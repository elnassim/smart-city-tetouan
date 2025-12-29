package com.smartcity.user.repository;

import com.smartcity.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByClerkId(String clerkId);
    void deleteByClerkId(String clerkId);
}
