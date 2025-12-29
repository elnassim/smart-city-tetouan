package com.smartcity.user.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private String clerkId;
    private String firstName;
    private String lastName;
    private String primaryEmail;
    private List<String> emailAddresses;
    private String imageUrl;
    private String publicMetadata; // JSON string
}
