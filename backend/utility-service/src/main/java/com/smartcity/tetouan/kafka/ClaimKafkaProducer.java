package com.smartcity.tetouan.kafka;

import com.smartcity.kafka.dto.ServiceResponseMessage;
import com.smartcity.kafka.dto.StatusUpdateMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClaimKafkaProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC_RESPONSES = "claims.responses";
    private static final String TOPIC_STATUS_UPDATES = "claims.status-updates";

    /**
     * Publish status update message
     */
    public void publishStatusUpdate(StatusUpdateMessage message) {
        try {
            kafkaTemplate.send(TOPIC_STATUS_UPDATES, message.getClaimId(), message)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.info("Status update published successfully for claim: {}, status: {}",
                                    message.getClaimNumber(), message.getStatus().getNewStatus());
                        } else {
                            log.error("Failed to publish status update for claim: {}", message.getClaimNumber(), ex);
                        }
                    });
        } catch (Exception e) {
            log.error("Error publishing status update for claim: {}", message.getClaimNumber(), e);
        }
    }

    /**
     * Publish service response message
     */
    public void publishServiceResponse(ServiceResponseMessage message) {
        try {
            kafkaTemplate.send(TOPIC_RESPONSES, message.getClaimId(), message)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.info("Service response published successfully for claim: {}",
                                    message.getClaimNumber());
                        } else {
                            log.error("Failed to publish service response for claim: {}", message.getClaimNumber(), ex);
                        }
                    });
        } catch (Exception e) {
            log.error("Error publishing service response for claim: {}", message.getClaimNumber(), e);
        }
    }
}
