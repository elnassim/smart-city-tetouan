package com.smartcity.tetouan.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/consumption")
public class ConsumptionController {
    @GetMapping
    public Map<String, Object> getConsumption() {
        return Map.of(
                "water", 1250,
                "electricity", 3400);
    }
}
