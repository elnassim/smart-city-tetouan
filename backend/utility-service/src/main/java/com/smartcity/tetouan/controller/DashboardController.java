package com.smartcity.tetouan.controller;

import com.smartcity.tetouan.dto.DashboardSummaryDTO;
import com.smartcity.tetouan.model.User;
import com.smartcity.tetouan.repository.UserRepository;
import com.smartcity.tetouan.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/summary/{userId}")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary(@PathVariable Long userId) {
        DashboardSummaryDTO summary = dashboardService.getDashboardSummary(userId);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/summary/clerk/{clerkUserId}")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummaryByClerkId(@PathVariable String clerkUserId) {
        User user = userRepository.findByClerkUserId(clerkUserId)
                .orElseThrow(() -> new RuntimeException("User not found with Clerk ID: " + clerkUserId));

        DashboardSummaryDTO summary = dashboardService.getDashboardSummary(user.getId());
        return ResponseEntity.ok(summary);
    }
}
