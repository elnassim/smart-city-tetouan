package com.smartcity.tetouan.dto;

import com.smartcity.tetouan.model.Claim;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimResponse {
    private String claimId;
    private String claimNumber;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String serviceType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String assignedTo;

    public static ClaimResponse fromEntity(Claim claim) {
        return ClaimResponse.builder()
                .claimId(claim.getClaimId())
                .claimNumber(claim.getClaimNumber())
                .title(claim.getTitle())
                .description(claim.getDescription())
                .status(claim.getStatus() != null ? claim.getStatus().name() : null)
                .priority(claim.getPriority())
                .serviceType(claim.getServiceType())
                .createdAt(claim.getCreatedAt())
                .updatedAt(claim.getUpdatedAt())
                .assignedTo(claim.getAssignedToOperatorName())
                .build();
    }
}
