package com.smartcity.tetouan.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "claims", indexes = {
    @Index(name = "idx_claim_id", columnList = "claim_id", unique = true),
    @Index(name = "idx_claim_number", columnList = "claim_number"),
    @Index(name = "idx_clerk_user_id", columnList = "clerk_user_id"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "claim_id", nullable = false, unique = true, length = 100)
    private String claimId;  // UUID from Kafka message

    @Column(name = "claim_number", nullable = false, length = 50)
    private String claimNumber;  // CLM-2024-00001

    @Column(name = "correlation_id", length = 100)
    private String correlationId;

    @Column(name = "clerk_user_id", nullable = false, length = 100)
    private String clerkUserId;

    @Column(name = "user_email", length = 255)
    private String userEmail;

    @Column(name = "user_name", length = 255)
    private String userName;

    @Column(name = "user_phone", length = 50)
    private String userPhone;

    @Column(name = "service_type", nullable = false, length = 50)
    private String serviceType;  // water, electricity, wem

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "priority", length = 20)
    private String priority;  // low, medium, high

    @Column(name = "status", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private ClaimStatus status;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "attachments", columnDefinition = "JSON")
    private String attachmentsJson;  // Stored as JSON string

    @Column(name = "extra_data", columnDefinition = "JSON")
    private String extraDataJson;  // Stored as JSON string

    @Column(name = "service_reference", length = 100)
    private String serviceReference;  // WRK-2024-456

    @Column(name = "assigned_to_operator_id", length = 100)
    private String assignedToOperatorId;

    @Column(name = "assigned_to_operator_name", length = 255)
    private String assignedToOperatorName;

    @Column(name = "resolution_summary", columnDefinition = "TEXT")
    private String resolutionSummary;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ClaimStatus {
        SUBMITTED,
        RECEIVED,
        ASSIGNED,
        IN_PROGRESS,
        PENDING_INFO,
        RESOLVED,
        REJECTED
    }
}
