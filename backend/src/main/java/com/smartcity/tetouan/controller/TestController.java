package com.smartcity.tetouan.controller;

import com.smartcity.tetouan.service.ClerkUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private ClerkUserService clerkUserService;

    @GetMapping("/auth")
    public ResponseEntity<Map<String, Object>> testAuth() {
        String userId = clerkUserService.getCurrentUserId();
        String userEmail = clerkUserService.getUserEmail();
        String userName = clerkUserService.getUserName();

        return ResponseEntity.ok(Map.of(
                "message", "Authentication successful!",
                "userId", userId,
                "userEmail", userEmail,
                "userName", userName,
                "timestamp", java.time.LocalDateTime.now()));
    }

    @GetMapping("/public")
    public ResponseEntity<Map<String, String>> publicEndpoint() {
        return ResponseEntity.ok(Map.of(
                "message", "This is a public endpoint",
                "timestamp", java.time.LocalDateTime.now().toString()));
    }
}
