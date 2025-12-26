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
public class ServiceResponseMessage {
    private String messageId;
    private MessageType messageType;   // SERVICE_RESPONSE
    private String timestamp;          // ISO 8601
    private String version;            // "1.0"
    private String claimId;
    private String claimNumber;
    private String correlationId;
    private ResponseInfo response;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseInfo {
        private FromInfo from;
        private String message;
        private List<AttachmentInfo> attachments;
        private String serviceReference;   // WRK-2024-456
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FromInfo {
        private String serviceType;      // "water", "electricity", "wem"
        private String operatorId;
        private String operatorName;
    }
}
