package com.smartcity.traffic.kafka;

import java.time.Instant;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcity.traffic.model.Incident;
import com.smartcity.traffic.repository.IncidentRepository;

@Service
public class ClaimsConsumer {
    private static final Logger log = LoggerFactory.getLogger(ClaimsConsumer.class);

    private final IncidentRepository repo;
    private final ObjectMapper mapper;

    public ClaimsConsumer(IncidentRepository repo, ObjectMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    @KafkaListener(topics = "claims.traffic", groupId = "${spring.kafka.consumer.group-id:claims-processor}")
    public void listen(String message,
                       @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                       @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            JsonNode root = mapper.readTree(message);
            String messageId = root.path("messageId").asText(null);
            if (messageId == null || messageId.isBlank()) {
                log.warn("Skipping message without messageId");
                return;
            }

            if (repo.existsByMessageId(messageId)) {
                log.info("Already processed messageId={}", messageId);
                return;
            }

            Incident inc = new Incident();
            inc.setId(UUID.randomUUID());
            inc.setMessageId(messageId);
            inc.setClaimNumber(root.path("claimNumber").asText(null));

            JsonNode claim = root.path("claim");
            if (!claim.isMissingNode()) {
                inc.setServiceType(claim.path("serviceType").asText(null));
                inc.setTitle(claim.path("title").asText(null));
                inc.setDescription(claim.path("description").asText(null));

                JsonNode loc = claim.path("location");
                if (!loc.isMissingNode()) {
                    inc.setAddress(loc.path("address").asText(null));
                    if (loc.has("latitude") && !loc.get("latitude").isNull()) {
                        inc.setLatitude(loc.get("latitude").asDouble());
                    }
                    if (loc.has("longitude") && !loc.get("longitude").isNull()) {
                        inc.setLongitude(loc.get("longitude").asDouble());
                    }
                }

                if (claim.path("attachments").isArray()) {
                    inc.setAttachments(mapper.writeValueAsString(claim.path("attachments")));
                }
                if (claim.path("extraData").isObject()) {
                    inc.setExtraData(mapper.writeValueAsString(claim.path("extraData")));
                }
            }

            inc.setCreatedAt(Instant.now());
            repo.save(inc);
            log.info("Persisted incident from messageId={} partition={} offset={}", messageId, partition, offset);
        } catch (Exception e) {
            log.error("Error processing incoming claim message", e);
        }
    }
}
