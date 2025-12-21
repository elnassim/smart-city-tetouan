package com.smartcity.tetouan.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ClerkUserService {

    public String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            return jwt.getSubject(); // Clerk user ID
        }
        return null;
    }

    public Map<String, Object> getUserClaims() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            return jwt.getClaims();
        }
        return Map.of();
    }

    public String getUserEmail() {
        Map<String, Object> claims = getUserClaims();
        return claims.get("email") != null ? claims.get("email").toString() : null;
    }

    public String getUserName() {
        Map<String, Object> claims = getUserClaims();
        String firstName = claims.get("firstName") != null ? claims.get("firstName").toString() : "";
        String lastName = claims.get("lastName") != null ? claims.get("lastName").toString() : "";
        return String.format("%s %s", firstName, lastName).trim();
    }
}
