package com.example.clerk_webhook_service.controllers;

import java.net.http.HttpHeaders;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.clerk_webhook_service.clients.UserClient;
import com.example.clerk_webhook_service.dtos.SessionDTO;
import com.example.clerk_webhook_service.dtos.UserDTO;
import com.svix.Webhook;

import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/api/clerk")
public class WebhookController {

    
    @Value("${CLERK_WEBHOOK_SECRET:${clerk.webhook.secret:}}")
    private String webhookSecret;

    @Value("${user.service.url:${USER_SERVICE_URL:http://localhost:8083}}")
    private String userServiceUrl;

    @Autowired
    private UserClient userClient;

    @PostConstruct
    public void init() {
        System.out.println("[clerk-webhook] webhookSecret set? " + (webhookSecret != null && !webhookSecret.isBlank()));
        System.out.println("[clerk-webhook] user.service.url = " + userServiceUrl);
    }


    @PostMapping("/webhook")
    public ResponseEntity<String> handleClerkEvent(
            @RequestBody String payload,
            @RequestHeader Map<String, String> headers) {
        System.out.println("---------------- Clerk webhook received ------------");


        Map<String, List<String>> headerMap = headers.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> List.of(e.getValue())));


        HttpHeaders svixHeaders = HttpHeaders.of(
                headerMap,
                (key, values) -> true
        );

       
        if (webhookSecret == null || webhookSecret.isBlank()) {
            System.out.println("WARNING: CLERK_WEBHOOK_SECRET not set - skipping signature verification (DEV ONLY)");
        } else {
            try {
                Webhook webhook = new Webhook(webhookSecret);
                webhook.verify(payload, svixHeaders);
            } catch (Exception e) {
                return ResponseEntity.status(401).body("Invalid signature");
            }
        }

        JSONObject json = new JSONObject(payload);
        String eventType = json.getString("type");
        JSONObject data = json.getJSONObject("data");

        if ("user.deleted".equals(eventType)) {
            try {
                userClient.deleteUser(data.getString("id"));
                System.out.println("Delete User  ");
            } catch (Exception ex) {
                System.err.println("[clerk-webhook] failed to delete user: " + ex.getMessage());
            }

        }
        else if ("user.created".equals(eventType) || "user.updated".equals(eventType)) {
            UserDTO dto = new UserDTO();
            dto.setClerkId(data.getString("id"));
            dto.setFirstName(data.optString("first_name", "--"));
            dto.setLastName(data.optString("last_name", "--"));
            dto.setImageUrl(data.optString("image_url", ""));
            
            try {
                userClient.syncUser(dto);
                System.out.println("Create/Update User  ");
            } catch (Exception ex) {
                System.err.println("[clerk-webhook] failed to sync user: " + ex.getMessage());
            }
            String primaryEmailId = data.optString("primary_email_address_id");
            String primaryEmail = null;
            List<String> allEmails = new ArrayList<>();
            JSONArray emailArr = data.optJSONArray("email_addresses");
            if (emailArr != null) {
                for (int i = 0; i < emailArr.length(); i++) {
                    JSONObject emailObj = emailArr.getJSONObject(i);
                    String email = emailObj.getString("email_address");
                    String id = emailObj.getString("id");

                    
                    if (id.equals(primaryEmailId)) {
                        primaryEmail = email;
                    }

                    
                    allEmails.add(email);
                }
            }
            dto.setPrimaryEmail(primaryEmail);
            dto.setEmailAddresses(allEmails);



            String primaryPhoneId = data.optString("primary_phone_number_id");
            String primaryPhone = null;
            List<String> allPhones = new ArrayList<>();

            JSONArray phoneArr = data.optJSONArray("phone_numbers");
            if (phoneArr != null) {
                for (int i = 0; i < phoneArr.length(); i++) {
                    JSONObject phoneObj = phoneArr.getJSONObject(i);
                    String phone = phoneObj.getString("phone_number");
                    String id = phoneObj.getString("id");

                    
                    if (id.equals(primaryPhoneId)) {
                        primaryPhone = phone;
                    }

                  
                    allPhones.add(phone);
                }
            }
            dto.setPrimaryPhoneNumber(primaryPhone);
            dto.setPhoneNumbers(allPhones);


            if (data.has("public_metadata")) {
                dto.setPublicMetadata(data.getJSONObject("public_metadata").toString());
            }

            userClient.syncUser(dto);
            System.out.println("Create/Update User  ");

        }else if ("session.created".equals(eventType) || "session.ended".equals(eventType)) {
            SessionDTO sessionDto = new SessionDTO();

            sessionDto.setSessionId(data.getString("id"));
            sessionDto.setClerkId(data.getString("user_id")); 
            sessionDto.setStatus(data.getString("status"));
            sessionDto.setCreatedAt(data.optLong("created_at"));

            if ("session.ended".equals(eventType)) {
                sessionDto.setAbandonedAt(data.optLong("abandoned_at"));
                System.out.println("Déconnexion détectée pour : " + sessionDto.getClerkId());
            } else {
                System.out.println("Connexion détectée pour : " + sessionDto.getClerkId());
            }

            userClient.syncSession(sessionDto);
        }

        return ResponseEntity.ok("OK");
    }
}
