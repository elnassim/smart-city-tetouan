package com.smartcity.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateMessage {
    private String messageId;
    private MessageType messageType;   // STATUS_UPDATE
    private String timestamp;          // ISO 8601
    private String version;            // "1.0"
    private String claimId;
    private String claimNumber;
    private String correlationId;
    private StatusInfo status;
    private ResolutionInfo resolution;  // Only when status is "resolved"
    private String serviceReference;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusInfo {
        private String previous;        // previous status
        private String newStatus;       // new status ("new" is reserved keyword)
        private String reason;
        private AssignedToInfo assignedTo;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignedToInfo {
        private String operatorId;
        private String operatorName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResolutionInfo {
        private String summary;
        private List<String> actionsTaken;
        private String closingMessage;
    }
}
