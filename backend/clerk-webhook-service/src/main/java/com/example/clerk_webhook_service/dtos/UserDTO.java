package com.example.clerk_webhook_service.dtos;
import lombok.Data;
import java.util.List;



@Data
public class UserDTO {
    private String clerkId;
    private String firstName;
    private String lastName;
    private List<String> emailAddresses; // Liste complète
    private List<String> phoneNumbers;   // Liste complète
    private String imageUrl;
    private String publicMetadata;       // JSON en String
    private Long createdAt;              // BigInt

    private String primaryEmail;
    private String primaryPhoneNumber;
}