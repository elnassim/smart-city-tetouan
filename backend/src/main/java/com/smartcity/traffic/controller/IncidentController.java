package com.smartcity.traffic.controller;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcity.traffic.model.Incident;
import com.smartcity.traffic.repository.IncidentRepository;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentRepository repo;
    private final org.springframework.kafka.core.KafkaTemplate<String, String> kafkaTemplate;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public IncidentController(IncidentRepository repo, org.springframework.kafka.core.KafkaTemplate<String, String> kafkaTemplate, com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        this.repo = repo;
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<Incident> create(@RequestBody com.smartcity.traffic.dto.IncidentRequest payload, Authentication auth) {
        String userId = auth != null ? auth.getName() : (payload.user != null ? payload.user.id : null);

        // Map payload to entity
        Incident incident = new Incident();
        try {
            if (payload.claimId != null && !payload.claimId.isBlank()) {
                incident.setId(java.util.UUID.fromString(payload.claimId));
            } else {
                incident.setId(UUID.randomUUID());
            }
        } catch (Exception ex) {
            incident.setId(UUID.randomUUID());
        }

        incident.setClaimNumber(payload.claimNumber);
        if (payload.claim != null) {
            incident.setServiceType(payload.claim.serviceType);
            incident.setTitle(payload.claim.title);
            incident.setDescription(payload.claim.description);
            incident.setPriority(payload.claim.priority);
            if (payload.claim.location != null) {
                incident.setAddress(payload.claim.location.address);
                incident.setLatitude(payload.claim.location.latitude);
                incident.setLongitude(payload.claim.location.longitude);
            }
            try {
                if (payload.claim.attachments != null) {
                    incident.setAttachments(objectMapper.writeValueAsString(payload.claim.attachments));
                }
                if (payload.claim.extraData != null) {
                    incident.setExtraData(objectMapper.writeValueAsString(payload.claim.extraData));
                }
            } catch (Exception e) {
            }
        }

      
        String messageId = java.util.UUID.randomUUID().toString();
        incident.setMessageId(messageId);
        incident.setUserId(userId);
        incident.setStatus("submitted");
        incident.setCreatedAt(Instant.now());

        Incident saved = repo.save(incident);

        try {
            com.smartcity.traffic.dto.IncidentRequest out = payload;
            if (out == null) out = new com.smartcity.traffic.dto.IncidentRequest();
            out.messageId = messageId;
            if (out.claimId == null || out.claimId.isBlank()) out.claimId = saved.getId().toString();
            if (out.claimNumber == null) out.claimNumber = saved.getClaimNumber();
            if (out.timestamp == null) out.timestamp = java.time.Instant.now().toString();
            if (out.user == null) {
                out.user = new com.smartcity.traffic.dto.IncidentRequest.UserInfo();
                out.user.id = userId;
            }
            String msg = objectMapper.writeValueAsString(out);

            java.util.concurrent.CompletableFuture<org.springframework.kafka.support.SendResult<String, String>> future = kafkaTemplate.send("claims.traffic", saved.getId().toString(), msg);
            future.whenComplete((result, ex) -> {
                if (ex != null) {
                    org.slf4j.LoggerFactory.getLogger(IncidentController.class)
                            .error("[IncidentController] failed to publish claim to Kafka", ex);
                } else {
                    org.slf4j.LoggerFactory.getLogger(IncidentController.class)
                            .info("[IncidentController] published claim {} to topic {} partition={} offset={}", saved.getId(), result.getRecordMetadata().topic(), result.getRecordMetadata().partition(), result.getRecordMetadata().offset());
                }
            });
        } catch (Exception ex) {
           
            org.slf4j.LoggerFactory.getLogger(IncidentController.class).error("[IncidentController] failed to publish claim to Kafka: {}", ex.getMessage(), ex);
        }

        return ResponseEntity.accepted().body(saved);
    }

    @GetMapping
    public List<Incident> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> get(@PathVariable UUID id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable UUID id, @RequestBody java.util.Map<String, Object> body, Authentication auth) {
        var opt = repo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Incident incident = opt.get();
        String prev = incident.getStatus();
        String next = (String) body.getOrDefault("status", body.get("newStatus"));
        if (next == null) return ResponseEntity.badRequest().body(java.util.Map.of("error", "missing status"));
        
        if (!java.util.Set.of("submitted","in_progress","resolved").contains(next)) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "invalid status"));
        }
        String reason = (String) body.getOrDefault("reason", "");

        incident.setStatus(next);
        Incident saved = repo.save(incident);

     
        try {
            String msgId = java.util.UUID.randomUUID().toString();
            java.util.Map<String,Object> msg = new java.util.LinkedHashMap<>();
            msg.put("messageId", msgId);
            msg.put("messageType", "STATUS_UPDATE");
            msg.put("timestamp", java.time.Instant.now().toString());
            msg.put("version", "1.0");
            msg.put("claimId", saved.getId().toString());
            msg.put("claimNumber", saved.getClaimNumber());
            msg.put("correlationId", saved.getMessageId());
            java.util.Map<String,Object> status = new java.util.LinkedHashMap<>();
            status.put("previous", prev);
            status.put("new", next);
            status.put("reason", reason);
            msg.put("status", status);

            String out = objectMapper.writeValueAsString(msg);
            java.util.concurrent.CompletableFuture<org.springframework.kafka.support.SendResult<String, String>> future = kafkaTemplate.send("claims.status-updates", saved.getId().toString(), out);
            future.whenComplete((result, ex) -> {
                if (ex != null) {
                    org.slf4j.LoggerFactory.getLogger(IncidentController.class).error("[IncidentController] failed to publish status update", ex);
                } else {
                    org.slf4j.LoggerFactory.getLogger(IncidentController.class).info("[IncidentController] published status update {} to topic {} partition={} offset={}", saved.getId(), result.getRecordMetadata().topic(), result.getRecordMetadata().partition(), result.getRecordMetadata().offset());
                }
            });
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(IncidentController.class).error("[IncidentController] failed to build/publish status update: {}", e.getMessage(), e);
        }

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/responses")
    public ResponseEntity<?> sendResponse(@PathVariable UUID id, @RequestBody java.util.Map<String,Object> body, Authentication auth) {
        var opt = repo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Incident incident = opt.get();

        String message = (String) body.getOrDefault("message", body.get("text"));
        if (message == null || message.isBlank()) return ResponseEntity.badRequest().body(java.util.Map.of("error", "missing message"));

        try {
            String msgId = java.util.UUID.randomUUID().toString();
            java.util.Map<String,Object> msg = new java.util.LinkedHashMap<>();
            msg.put("messageId", msgId);
            msg.put("messageType", "SERVICE_RESPONSE");
            msg.put("timestamp", java.time.Instant.now().toString());
            msg.put("version", "1.0");
            msg.put("claimId", incident.getId().toString());
            msg.put("claimNumber", incident.getClaimNumber());
            msg.put("correlationId", incident.getMessageId());

            java.util.Map<String,Object> response = new java.util.LinkedHashMap<>();
            java.util.Map<String,Object> from = new java.util.LinkedHashMap<>();
            from.put("serviceType", incident.getServiceType());
            String operatorId = auth != null ? auth.getName() : "system";
            from.put("operatorId", operatorId);
            from.put("operatorName", operatorId);
            response.put("from", from);
            response.put("message", message);
            if (body.containsKey("attachments")) response.put("attachments", body.get("attachments"));
            msg.put("response", response);

            String out = objectMapper.writeValueAsString(msg);
            java.util.concurrent.CompletableFuture<org.springframework.kafka.support.SendResult<String, String>> future = kafkaTemplate.send("claims.responses", incident.getId().toString(), out);
            future.whenComplete((result, ex) -> {
                if (ex != null) {
                    org.slf4j.LoggerFactory.getLogger(IncidentController.class).error("[IncidentController] failed to publish response", ex);
                } else {
                    org.slf4j.LoggerFactory.getLogger(IncidentController.class).info("[IncidentController] published response {} to topic {} partition={} offset={}", incident.getId(), result.getRecordMetadata().topic(), result.getRecordMetadata().partition(), result.getRecordMetadata().offset());
                }
            });
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(IncidentController.class).error("[IncidentController] failed to build/publish response: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(java.util.Map.of("error", "failed to publish"));
        }

        return ResponseEntity.accepted().build();
    }
}
