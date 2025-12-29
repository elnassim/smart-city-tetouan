package com.smartcity.user.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcity.user.dto.UserDTO;
import com.smartcity.user.model.User;
import com.smartcity.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    @PostMapping
    public ResponseEntity<User> syncUser(@RequestBody UserDTO dto) {
        Optional<User> existing = userRepository.findByClerkId(dto.getClerkId());
        User user = existing.orElseGet(User::new);
        user.setClerkId(dto.getClerkId());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPrimaryEmail(dto.getPrimaryEmail());
        user.setImageUrl(dto.getImageUrl());

        Set<String> roles = user.getRoles();
        if (roles == null) roles = new HashSet<>();
        if (roles.isEmpty()) roles.add("CITOYEN");

        if (dto.getPublicMetadata() != null && !dto.getPublicMetadata().isBlank()) {
            try {
                JsonNode root = mapper.readTree(dto.getPublicMetadata());
                if (root.has("role")) {
                    String r = root.get("role").asText();
                    roles.clear();
                    roles.add(r.toUpperCase());
                }
            } catch (Exception ignored) {
            }
        }

        user.setRoles(roles);
        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{clerkId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String clerkId) {
        userRepository.deleteByClerkId(clerkId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sessions")
    public ResponseEntity<Void> syncSession(@RequestBody Map<String, Object> payload) {
        System.out.println("Session sync: " + payload);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(@RequestHeader(name = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Missing Authorization header"));
        }
        String token = authorization.substring(7);
        try {
            String[] parts = token.split("\\.");
            if (parts.length < 2) return ResponseEntity.status(400).body(Map.of("error", "Invalid token"));
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            JsonNode root = mapper.readTree(payload);
            String clerkId = null;
            if (root.has("sub")) clerkId = root.get("sub").asText();
            if (clerkId == null && root.has("user_id")) clerkId = root.get("user_id").asText();
            if (clerkId == null) return ResponseEntity.status(400).body(Map.of("error", "No user id in token"));
            Optional<User> user = userRepository.findByClerkId(clerkId);
            if (user.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            User u = user.get();
            Map<String, Object> res = new HashMap<>();
            res.put("clerkId", u.getClerkId());
            res.put("firstName", u.getFirstName());
            res.put("lastName", u.getLastName());
            res.put("primaryEmail", u.getPrimaryEmail());
            res.put("roles", u.getRoles());
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to parse token"));
        }
    }

    @GetMapping("/{clerkId}")
    public ResponseEntity<User> getByClerkId(@PathVariable String clerkId) {
        Optional<User> user = userRepository.findByClerkId(clerkId);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(404).build());
    }

    @GetMapping
    public ResponseEntity<List<User>> listAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
