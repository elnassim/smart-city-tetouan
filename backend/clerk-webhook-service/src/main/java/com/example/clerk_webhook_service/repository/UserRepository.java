package com.example.clerk_webhook_service.repository;

import com.example.clerk_webhook_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByClerkUserId(String clerkUserId);

    boolean existsByClerkUserId(String clerkUserId);
}
