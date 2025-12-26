package com.smartcity.tetouan.repository;

import com.smartcity.tetouan.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    /**
     * Find claim by its UUID (for idempotency check)
     */
    Optional<Claim> findByClaimId(String claimId);

    /**
     * Check if claim already exists (for idempotency)
     */
    boolean existsByClaimId(String claimId);

    /**
     * Find by claim number
     */
    Optional<Claim> findByClaimNumber(String claimNumber);

    /**
     * Find all claims for a specific user
     */
    List<Claim> findByClerkUserId(String clerkUserId);
}
