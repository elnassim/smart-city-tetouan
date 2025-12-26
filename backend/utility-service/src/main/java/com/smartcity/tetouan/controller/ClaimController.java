package com.smartcity.tetouan.controller;

import com.smartcity.tetouan.dto.ClaimResponse;
import com.smartcity.tetouan.dto.CreateClaimRequest;
import com.smartcity.tetouan.service.ClaimApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ClaimController {

    private final ClaimApiService claimApiService;

    /**
     * Create a new claim
     */
    @PostMapping
    public ResponseEntity<ClaimResponse> createClaim(@RequestBody CreateClaimRequest request) {
        try {
            log.info("Received claim creation request: title={}, category={}", request.getTitle(), request.getCategory());
            ClaimResponse response = claimApiService.createClaim(request);
            log.info("Claim created successfully: claimId={}, claimNumber={}", response.getClaimId(), response.getClaimNumber());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error creating claim", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all claims for a specific user
     */
    @GetMapping("/user/{clerkUserId}")
    public ResponseEntity<List<ClaimResponse>> getUserClaims(@PathVariable String clerkUserId) {
        try {
            log.info("Fetching claims for user: {}", clerkUserId);
            List<ClaimResponse> claims = claimApiService.getUserClaims(clerkUserId);
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            log.error("Error fetching user claims", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all claims (admin)
     */
    @GetMapping
    public ResponseEntity<List<ClaimResponse>> getAllClaims() {
        try {
            log.info("Fetching all claims");
            List<ClaimResponse> claims = claimApiService.getAllClaims();
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            log.error("Error fetching all claims", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get claim by ID
     */
    @GetMapping("/{claimId}")
    public ResponseEntity<ClaimResponse> getClaimById(@PathVariable String claimId) {
        try {
            log.info("Fetching claim: {}", claimId);
            ClaimResponse claim = claimApiService.getClaimById(claimId);
            return ResponseEntity.ok(claim);
        } catch (RuntimeException e) {
            log.error("Claim not found: {}", claimId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error fetching claim", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
