package com.smartcity.traffic.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtVerifier verifier;
    private final boolean skipVerification;

    public JwtAuthFilter(JwtVerifier verifier, boolean skipVerification) {
        this.verifier = verifier;
        this.skipVerification = skipVerification;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            try {
                String userId = null;
                if (skipVerification) {
                    String[] parts = token.split("\\.");
                    if (parts.length >= 2) {
                        try {
                            byte[] decoded = java.util.Base64.getUrlDecoder().decode(parts[1]);
                            String payloadJson = new String(decoded);
                            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                            java.util.Map payload = mapper.readValue(payloadJson, java.util.Map.class);
                            userId = (String) payload.get("sub");
                        } catch (Exception e) {

                            org.slf4j.LoggerFactory.getLogger(JwtAuthFilter.class).debug("Failed to parse dev JWT payload: {}", e.getMessage());
                        }
                    }
                } else {
                    var claims = verifier.verify(token);
                    userId = claims.getSubject();
                }

                if (userId != null) {
                    var authToken = new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
            
            }
        }

        filterChain.doFilter(request, response);
    }
}
