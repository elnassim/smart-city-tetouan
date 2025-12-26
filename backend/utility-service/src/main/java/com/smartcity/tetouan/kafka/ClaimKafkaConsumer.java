package com.smartcity.tetouan.kafka;

import com.smartcity.kafka.dto.IncomingClaimMessage;
import com.smartcity.tetouan.service.ClaimService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ClaimKafkaConsumer {

    private final ClaimService claimService;

    /**
     * Listen to claims.WEM topic
     * Process incoming claim messages with manual acknowledgment for idempotency
     */
    @KafkaListener(
            topics = "claims.WEM",
            groupId = "${kafka.consumer.group-id:wem-claims-group}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeClaimMessage(
            @Payload IncomingClaimMessage message,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment acknowledgment
    ) {
        log.info("Received claim message from Kafka: claimId={}, claimNumber={}, partition={}, offset={}",
                message.getClaimId(), message.getClaimNumber(), partition, offset);

        try {
            // Validate message
            if (!isValidMessage(message)) {
                log.error("Invalid claim message received: claimId={}, claimNumber={}",
                        message.getClaimId(), message.getClaimNumber());
                // Acknowledge to prevent reprocessing of invalid messages
                acknowledgment.acknowledge();
                return;
            }

            // Process claim with idempotency
            boolean processed = claimService.processIncomingClaim(message);

            if (processed) {
                log.info("Claim processed successfully: claimId={}, claimNumber={}",
                        message.getClaimId(), message.getClaimNumber());
            } else {
                log.info("Claim skipped (duplicate): claimId={}, claimNumber={}",
                        message.getClaimId(), message.getClaimNumber());
            }

            // Acknowledge successful processing
            acknowledgment.acknowledge();

        } catch (Exception e) {
            log.error("Error processing claim message: claimId={}, claimNumber={}",
                    message.getClaimId(), message.getClaimNumber(), e);
            // Do NOT acknowledge - message will be reprocessed
            // In production, consider DLQ (Dead Letter Queue) after retry limit
            throw e;
        }
    }

    /**
     * Validate incoming message
     */
    private boolean isValidMessage(IncomingClaimMessage message) {
        if (message == null) {
            log.error("Null message received");
            return false;
        }

        if (message.getClaimId() == null || message.getClaimId().isEmpty()) {
            log.error("Missing claimId in message");
            return false;
        }

        if (message.getClaimNumber() == null || message.getClaimNumber().isEmpty()) {
            log.error("Missing claimNumber in message");
            return false;
        }

        if (message.getUser() == null || message.getUser().getId() == null) {
            log.error("Missing user information in message");
            return false;
        }

        if (message.getClaim() == null) {
            log.error("Missing claim information in message");
            return false;
        }

        return true;
    }
}
