package com.smartcity.tetouan.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "meters")
public class Meter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meter_number", unique = true, nullable = false, length = 50)
    private String meterNumber;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeterType type;

    @Column(name = "location_address", columnDefinition = "TEXT")
    private String locationAddress;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeterStatus status = MeterStatus.ACTIVE;

    @Column(name = "installed_at")
    private LocalDate installedAt;

    public enum MeterType {
        WATER, ELECTRICITY
    }

    public enum MeterStatus {
        ACTIVE, INACTIVE, MAINTENANCE
    }
}
