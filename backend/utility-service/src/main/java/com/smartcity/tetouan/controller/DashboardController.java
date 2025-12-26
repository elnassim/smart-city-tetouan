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
        // Find user by Clerk ID, or return empty dashboard if user doesn't exist yet
        User user = userRepository.findByClerkUserId(clerkUserId)
                .orElse(null);

        if (user == null) {
            // Return empty dashboard for new users
            return ResponseEntity.ok(createEmptyDashboard());
        }

        DashboardSummaryDTO summary = dashboardService.getDashboardSummary(user.getId());
        return ResponseEntity.ok(summary);
    }

    private DashboardSummaryDTO createEmptyDashboard() {
        DashboardSummaryDTO dashboard = new DashboardSummaryDTO();

        // Empty consumption data
        DashboardSummaryDTO.ConsumptionData consumption = new DashboardSummaryDTO.ConsumptionData();
        consumption.setWater(new DashboardSummaryDTO.MetricData(
            java.math.BigDecimal.ZERO, java.math.BigDecimal.ZERO, "stable", "m³", "💧"
        ));
        consumption.setElectricity(new DashboardSummaryDTO.MetricData(
            java.math.BigDecimal.ZERO, java.math.BigDecimal.ZERO, "stable", "kWh", "⚡"
        ));
        dashboard.setConsumption(consumption);

        // Empty billing data
        DashboardSummaryDTO.BillingData billing = new DashboardSummaryDTO.BillingData();
        billing.setTotalAmount(java.math.BigDecimal.ZERO);
        billing.setDueDate("N/A");
        billing.setStatus("Aucune facture");
        billing.setIcon("💳");
        billing.setBreakdown(new DashboardSummaryDTO.BillBreakdown(
            java.math.BigDecimal.ZERO, java.math.BigDecimal.ZERO
        ));
        dashboard.setBilling(billing);

        // Empty weekly consumption
        dashboard.setWeeklyConsumption(java.util.Collections.emptyList());

        // Empty alerts
        dashboard.setAlerts(java.util.Collections.emptyList());

        // Empty user info
        dashboard.setUser(new DashboardSummaryDTO.UserInfo("N/A", "Nouvel utilisateur", "citizen"));

        return dashboard;
    }
}
