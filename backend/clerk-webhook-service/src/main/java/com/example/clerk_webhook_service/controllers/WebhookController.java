package com.example.clerk_webhook_service.controllers;

import com.example.clerk_webhook_service.model.User;
import com.example.clerk_webhook_service.repository.UserRepository;
import com.svix.Webhook;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpHeaders;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    @Value("${clerk.webhook.secret}")
    private String webhookSecret;

    @Autowired
    private UserRepository userRepository;


    @PostMapping("/clerk")
    public ResponseEntity<String> handleClerkEvent(
            @RequestBody String payload,
            @RequestHeader Map<String, String> headers) {
        System.out.println("----------------clerk fait un appel------------");


        Map<String, List<String>> headerMap = headers.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> List.of(e.getValue())));


        HttpHeaders svixHeaders = HttpHeaders.of(
                headerMap,
                (key, values) -> true
        );

        try {
            Webhook webhook = new Webhook(webhookSecret);
            webhook.verify(payload, svixHeaders);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Signature invalide");
        }

        JSONObject json = new JSONObject(payload);
        String eventType = json.getString("type");
        JSONObject data = json.getJSONObject("data");

        if ("user.deleted".equals(eventType)) {
            String clerkUserId = data.getString("id");
            User user = userRepository.findByClerkUserId(clerkUserId);
            if (user != null) {
                userRepository.delete(user);
                System.out.println("✅ User deleted: " + clerkUserId);
            }
        }
        else if ("user.created".equals(eventType) || "user.updated".equals(eventType)) {
            String clerkUserId = data.getString("id");
            String firstName = data.optString("first_name", "");
            String lastName = data.optString("last_name", "");

            // Get primary email
            String primaryEmailId = data.optString("primary_email_address_id");
            String email = null;
            JSONArray emailArr = data.optJSONArray("email_addresses");
            if (emailArr != null) {
                for (int i = 0; i < emailArr.length(); i++) {
                    JSONObject emailObj = emailArr.getJSONObject(i);
                    String emailAddress = emailObj.getString("email_address");
                    String id = emailObj.getString("id");

                    if (id.equals(primaryEmailId)) {
                        email = emailAddress;
                        break;
                    }
                }
            }

            // Get primary phone
            String primaryPhoneId = data.optString("primary_phone_number_id");
            String phone = null;
            JSONArray phoneArr = data.optJSONArray("phone_numbers");
            if (phoneArr != null) {
                for (int i = 0; i < phoneArr.length(); i++) {
                    JSONObject phoneObj = phoneArr.getJSONObject(i);
                    String phoneNumber = phoneObj.getString("phone_number");
                    String id = phoneObj.getString("id");

                    if (id.equals(primaryPhoneId)) {
                        phone = phoneNumber;
                        break;
                    }
                }
            }

            // Check if user already exists
            User user = userRepository.findByClerkUserId(clerkUserId);
            if (user == null) {
                // Create new user
                user = new User();
                user.setClerkUserId(clerkUserId);
                user.setRole(User.Role.CITOYEN); // Default role
            }

            // Update user data
            user.setEmail(email != null ? email : "");
            user.setFullName((firstName + " " + lastName).trim());
            user.setPhone(phone);

            userRepository.save(user);
            System.out.println("✅ User " + ("user.created".equals(eventType) ? "created" : "updated") + ": " + email);
        }
        else if ("session.created".equals(eventType) || "session.ended".equals(eventType)) {
            String clerkUserId = data.getString("user_id");
            String status = data.getString("status");

            if ("session.ended".equals(eventType)) {
                System.out.println("🔒 Déconnexion détectée pour : " + clerkUserId);
            } else {
                System.out.println("🔓 Connexion détectée pour : " + clerkUserId);
            }
        }

        return ResponseEntity.ok("OK");
    }
}
