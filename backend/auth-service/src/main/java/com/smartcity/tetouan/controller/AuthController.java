package com.smartcity.tetouan.controller;

import com.smartcity.tetouan.service.ClerkUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final ClerkUserService clerkUserService;

    public AuthController(ClerkUserService clerkUserService) {
        this.clerkUserService = clerkUserService;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        String userId = clerkUserService.getCurrentUserId();
        String email = clerkUserService.getUserEmail();
        String name = clerkUserService.getUserName();

        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "email", email,
                "name", name));
    }

    @GetMapping("/public/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service is healthy");
    }
}
