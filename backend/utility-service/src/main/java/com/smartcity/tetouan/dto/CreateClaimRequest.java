package com.smartcity.tetouan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateClaimRequest {
    private String title;
    private String description;
    private String category;
    private String priority;
    private String meterType;
    private String meterNumber;
    private String location;
    private String address;
    private Double latitude;
    private Double longitude;
    private List<String> attachments;

    // User information (will be populated from Clerk auth)
    private String clerkUserId;
    private String userEmail;
    private String userName;
    private String userPhone;
}
