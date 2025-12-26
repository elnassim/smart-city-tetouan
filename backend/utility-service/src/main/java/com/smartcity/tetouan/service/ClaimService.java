package com.smartcity.tetouan.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcity.kafka.dto.*;
import com.smartcity.tetouan.kafka.ClaimKafkaProducer;
import com.smartcity.tetouan.model.Claim;
import com.smartcity.tetouan.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ClaimKafkaProducer kafkaProducer;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Process incoming claim message with idempotency
     * Returns true if processed, false if duplicate
     */
    @Transactional
    public boolean processIncomingClaim(IncomingClaimMessage message) {
        // Idempotency check - skip if already processed
        if (claimRepository.existsByClaimId(message.getClaimId())) {
            log.warn("Claim already exists (duplicate message): claimId={}, claimNumber={}",
                    message.getClaimId(), message.getClaimNumber());
            return false;
        }

        try {
            // Convert Kafka message to entity
            Claim claim = buildClaimFromMessage(message);

            // Persist to database
            claim = claimRepository.save(claim);
            log.info("Claim persisted successfully: claimId={}, claimNumber={}, status={}",
                    claim.getClaimId(), claim.getClaimNumber(), claim.getStatus());

            // Publish status update after successful DB commit
            publishStatusUpdate(claim, Claim.ClaimStatus.SUBMITTED.name(), "Claim received by WEM service");

            // Optionally publish service response
            publishServiceResponse(claim);

            return true;

        } catch (Exception e) {
            log.error("Error processing claim: claimId={}, claimNumber={}",
                    message.getClaimId(), message.getClaimNumber(), e);
            throw new RuntimeException("Failed to process claim", e);
        }
    }

    /**
     * Build Claim entity from Kafka message
     */
    private Claim buildClaimFromMessage(IncomingClaimMessage message) throws JsonProcessingException {
        ClaimInfo claimInfo = message.getClaim();
        UserInfo userInfo = message.getUser();

        return Claim.builder()
                .claimId(message.getClaimId())
                .claimNumber(message.getClaimNumber())
                .correlationId(message.getCorrelationId())
                .clerkUserId(userInfo.getId())
                .userEmail(userInfo.getEmail())
                .userName(userInfo.getName())
                .userPhone(userInfo.getPhone())
                .serviceType(claimInfo.getServiceType())
                .title(claimInfo.getTitle())
                .description(claimInfo.getDescription())
                .priority(claimInfo.getPriority())
                .status(Claim.ClaimStatus.RECEIVED)  // Set initial status to RECEIVED
                .address(claimInfo.getLocation() != null ? claimInfo.getLocation().getAddress() : null)
                .latitude(claimInfo.getLocation() != null ? claimInfo.getLocation().getLatitude() : null)
                .longitude(claimInfo.getLocation() != null ? claimInfo.getLocation().getLongitude() : null)
                .attachmentsJson(claimInfo.getAttachments() != null ?
                        objectMapper.writeValueAsString(claimInfo.getAttachments()) : null)
                .extraDataJson(claimInfo.getExtraData() != null ?
                        objectMapper.writeValueAsString(claimInfo.getExtraData()) : null)
                .build();
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
     * Publish service response message (optional acknowledgment)
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
                                .operatorId("WEM-SYSTEM")
                                .operatorName("WEM Auto-Processor")
                                .build())
                        .message("Your claim has been received and is being processed by the Water & Electricity Management service.")
                        .build())
                .build();

        kafkaProducer.publishServiceResponse(message);
    }
}
