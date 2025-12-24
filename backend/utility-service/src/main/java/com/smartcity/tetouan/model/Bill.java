package com.smartcity.tetouan.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "bills")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bill_number", unique = true, nullable = false, length = 50)
    private String billNumber;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "meter_id", nullable = false)
    private Long meterId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillStatus status = BillStatus.PENDING;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    public enum BillStatus {
        PENDING, PAID, OVERDUE
    }
}
