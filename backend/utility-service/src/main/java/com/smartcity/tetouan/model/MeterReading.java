package com.smartcity.tetouan.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "meter_readings")
public class MeterReading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meter_id", nullable = false)
    private Long meterId;

    @Column(name = "reading_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal readingValue;

    @Column(name = "reading_date", nullable = false)
    private LocalDateTime readingDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReadingSource source = ReadingSource.SMART;

    public enum ReadingSource {
        MANUAL, SMART
    }
}
