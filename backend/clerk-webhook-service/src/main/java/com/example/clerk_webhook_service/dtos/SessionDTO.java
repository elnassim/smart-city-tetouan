package com.example.clerk_webhook_service.dtos;

import lombok.Data;

@Data
public class SessionDTO {
    private String sessionId;
    private String clerkId;
    private String status;
    private Long createdAt;
    private Long abandonedAt;
}
