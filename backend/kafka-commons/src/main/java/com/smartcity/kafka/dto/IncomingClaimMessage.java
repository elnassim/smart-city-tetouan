package com.smartcity.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncomingClaimMessage {
    private String messageId;
    private MessageType messageType;   // CLAIM_CREATED
    private String timestamp;          // ISO 8601
    private String version;            // "1.0"
    private String claimId;            // UUID
    private String claimNumber;        // CLM-2024-00001
    private String correlationId;      // UUID
    private UserInfo user;
    private ClaimInfo claim;
}
