package com.smartcity.tetouan.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcity.kafka.dto.*;
import com.smartcity.tetouan.dto.CreateClaimRequest;
import com.smartcity.tetouan.dto.ClaimResponse;
import com.smartcity.tetouan.kafka.ClaimKafkaProducer;
import com.smartcity.tetouan.model.Claim;
import com.smartcity.tetouan.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClaimApiService {

    private final ClaimRepository claimRepository;
    private final ClaimKafkaProducer kafkaProducer;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Create a claim from the web portal and publish to Kafka
     */
    @Transactional
    public ClaimResponse createClaim(CreateClaimRequest request) {
        try {
            // Generate unique claim ID and number
            String claimId = UUID.randomUUID().toString();
            String claimNumber = generateClaimNumber();
            String correlationId = UUID.randomUUID().toString();

            log.info("Creating claim from portal: claimId={}, claimNumber={}", claimId, claimNumber);

            // Build claim entity
            Claim claim = buildClaimEntity(request, claimId, claimNumber, correlationId);

            // Save to database
            claim = claimRepository.save(claim);
            log.info("Claim saved to database: claimId={}, claimNumber={}", claimId, claimNumber);

            // Publish Kafka message to simulate incoming claim from portal
            publishClaimToKafka(claim, correlationId);

            return ClaimResponse.fromEntity(claim);

        } catch (Exception e) {
            log.error("Error creating claim: {}", request.getTitle(), e);
            throw new RuntimeException("Failed to create claim: " + e.getMessage(), e);
        }
    }

    /**
     * Get all claims for a specific user
     */
    public List<ClaimResponse> getUserClaims(String clerkUserId) {
        List<Claim> claims = claimRepository.findByClerkUserId(clerkUserId);
        return claims.stream()
                .map(ClaimResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get all claims (admin)
     */
    public List<ClaimResponse> getAllClaims() {
        List<Claim> claims = claimRepository.findAll();
        return claims.stream()
                .map(ClaimResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get claim by ID
     */
    public ClaimResponse getClaimById(String claimId) {
        Claim claim = claimRepository.findByClaimId(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found: " + claimId));
        return ClaimResponse.fromEntity(claim);
    }

    /**
     * Build claim entity from request
     */
    private Claim buildClaimEntity(CreateClaimRequest request, String claimId, String claimNumber, String correlationId) throws JsonProcessingException {
        return Claim.builder()
                .claimId(claimId)
                .claimNumber(claimNumber)
                .correlationId(correlationId)
                .clerkUserId(request.getClerkUserId())
                .userEmail(request.getUserEmail())
                .userName(request.getUserName())
                .userPhone(request.getUserPhone())
                .serviceType("wem")
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(Claim.ClaimStatus.SUBMITTED)  // Initial status
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .attachmentsJson(request.getAttachments() != null ?
                        objectMapper.writeValueAsString(request.getAttachments()) : null)
                .extraDataJson(objectMapper.writeValueAsString(buildExtraData(request)))
                .build();
    }

    /**
     * Build extra data from request
     */
    private Object buildExtraData(CreateClaimRequest request) {
        return new Object() {
            public final String category = request.getCategory();
            public final String meterType = request.getMeterType();
            public final String meterNumber = request.getMeterNumber();
            public final String location = request.getLocation();
        };
    }

    /**
     * Publish claim to Kafka as IncomingClaimMessage
     */
    private void publishClaimToKafka(Claim claim, String correlationId) throws JsonProcessingException {
        // Build Kafka message matching the contract
        IncomingClaimMessage message = IncomingClaimMessage.builder()
                .messageId(UUID.randomUUID().toString())
                .messageType(MessageType.CLAIM_CREATED)
                .timestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME))
                .version("1.0")
                .claimId(claim.getClaimId())
                .claimNumber(claim.getClaimNumber())
                .correlationId(correlationId)
                .user(UserInfo.builder()
                        .id(claim.getClerkUserId())
                        .email(claim.getUserEmail())
                        .name(claim.getUserName())
                        .phone(claim.getUserPhone())
                        .build())
                .claim(ClaimInfo.builder()
                        .serviceType(claim.getServiceType())
                        .title(claim.getTitle())
                        .description(claim.getDescription())
                        .priority(claim.getPriority())
                        .location(LocationInfo.builder()
                                .address(claim.getAddress())
                                .latitude(claim.getLatitude())
                                .longitude(claim.getLongitude())
                                .build())
                        .attachments(parseAttachments(claim.getAttachmentsJson()))
                        .extraData(null)
                        .build())
                .build();

        // Note: We're NOT actually publishing this to claims.WEM because we want to avoid circular processing
        // The claim is already in the database with status SUBMITTED
        // We'll just update it to RECEIVED and publish status update + response
        log.info("Claim created from portal, updating status to RECEIVED: claimId={}", claim.getClaimId());

        // Update status to RECEIVED
        claim.setStatus(Claim.ClaimStatus.RECEIVED);
        claimRepository.save(claim);

        // Publish status update
        publishStatusUpdate(claim, "SUBMITTED", "Claim received from citizen portal");

        // Publish service response
        publishServiceResponse(claim);
    }

    /**
     * Publish status update message
     */
    private void publishStatusUpdate(Claim claim, String previousStatus, String reason) {
        StatusUpdateMessage message = StatusUpdateMessage.builder()
                .messageId(UUID.randomUUID().toString())
                .messageType(MessageType.STATUS_UPDATE)
                .timestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME))
                .version("1.0")
                .claimId(claim.getClaimId())
                .claimNumber(claim.getClaimNumber())
                .correlationId(claim.getCorrelationId())
                .status(StatusUpdateMessage.StatusInfo.builder()
                        .previous(previousStatus)
                        .newStatus(claim.getStatus().name())
                        .reason(reason)
                        .build())
                .build();

        kafkaProducer.publishStatusUpdate(message);
    }

    /**
     * Publish service response message
     */
    private void publishServiceResponse(Claim claim) {
        ServiceResponseMessage message = ServiceResponseMessage.builder()
                .messageId(UUID.randomUUID().toString())
                .messageType(MessageType.SERVICE_RESPONSE)
                .timestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME))
                .version("1.0")
                .claimId(claim.getClaimId())
                .claimNumber(claim.getClaimNumber())
                .correlationId(claim.getCorrelationId())
                .response(ServiceResponseMessage.ResponseInfo.builder()
                        .from(ServiceResponseMessage.FromInfo.builder()
                                .serviceType("wem")
                                .operatorId("WEM-PORTAL")
                                .operatorName("WEM Citizen Portal")
                                .build())
                        .message("Your claim has been successfully submitted and is being processed by our team. You will receive updates via email.")
                        .build())
                .build();

        kafkaProducer.publishServiceResponse(message);
    }

    /**
     * Generate unique claim number
     */
    private String generateClaimNumber() {
        // Format: CLM-YYYY-XXXXX
        String year = String.valueOf(LocalDateTime.now().getYear());
        long count = claimRepository.count() + 1;
        return String.format("CLM-%s-%05d", year, count);
    }

    /**
     * Parse attachments JSON
     */
    private List<AttachmentInfo> parseAttachments(String json) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, AttachmentInfo.class));
        } catch (JsonProcessingException e) {
            log.warn("Failed to parse attachments JSON", e);
            return null;
        }
    }

    /**
     * Parse extra data JSON
     */
    private Object parseExtraData(String json) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, Object.class);
        } catch (JsonProcessingException e) {
            log.warn("Failed to parse extra data JSON", e);
            return null;
        }
    }
}
