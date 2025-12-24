package com.smartcity.tetouan.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {
    @GetMapping
    public List<Map<String, Object>> getClaims() {
        return List.of(
                Map.of("id", 1, "type", "Water", "status", "OPEN"),
                Map.of("id", 2, "type", "Electricity", "status", "IN_PROGRESS"));
    }
}
