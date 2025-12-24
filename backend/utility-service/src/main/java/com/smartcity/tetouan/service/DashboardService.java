package com.smartcity.tetouan.service;

import com.smartcity.tetouan.dto.DashboardSummaryDTO;
import com.smartcity.tetouan.model.*;
import com.smartcity.tetouan.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private MeterRepository meterRepository;

    @Autowired
    private MeterReadingRepository meterReadingRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public DashboardSummaryDTO getDashboardSummary(Long userId) {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();

        // Get user meters
        List<Meter> meters = meterRepository.findByUserId(userId);
        Meter waterMeter = meters.stream()
                .filter(m -> m.getType() == Meter.MeterType.WATER)
                .findFirst()
                .orElse(null);
        Meter electricityMeter = meters.stream()
                .filter(m -> m.getType() == Meter.MeterType.ELECTRICITY)
                .findFirst()
                .orElse(null);

        // Set consumption data
        summary.setConsumption(getConsumptionData(waterMeter, electricityMeter));

        // Set billing data
        summary.setBilling(getBillingData(userId, waterMeter, electricityMeter));

        // Set weekly consumption
        summary.setWeeklyConsumption(getWeeklyConsumption(waterMeter, electricityMeter));

        // Set alerts
        summary.setAlerts(getAlerts(userId));

        // Set user info
        summary.setUser(getUserInfo(userId, meters));

        return summary;
    }

    private DashboardSummaryDTO.ConsumptionData getConsumptionData(Meter waterMeter, Meter electricityMeter) {
        DashboardSummaryDTO.ConsumptionData consumption = new DashboardSummaryDTO.ConsumptionData();

        // Water consumption
        if (waterMeter != null) {
            consumption.setWater(getMetricData(waterMeter, "m³", "💧"));
        } else {
            consumption.setWater(createDefaultMetric(BigDecimal.ZERO, "m³", "💧"));
        }

        // Electricity consumption
        if (electricityMeter != null) {
            consumption.setElectricity(getMetricData(electricityMeter, "kWh", "⚡"));
        } else {
            consumption.setElectricity(createDefaultMetric(BigDecimal.ZERO, "kWh", "⚡"));
        }

        return consumption;
    }

    private DashboardSummaryDTO.MetricData getMetricData(Meter meter, String unit, String icon) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneMonthAgo = now.minusMonths(1);

        // Get current month readings
        List<MeterReading> currentReadings = meterReadingRepository.findRecentReadings(
                meter.getId(),
                now.minusDays(30)
        );

        // Get previous month readings
        List<MeterReading> previousReadings = meterReadingRepository.findRecentReadings(
                meter.getId(),
                oneMonthAgo
        );

        BigDecimal current = currentReadings.isEmpty() ? BigDecimal.ZERO :
                currentReadings.stream()
                        .map(MeterReading::getReadingValue)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal previous = previousReadings.isEmpty() ? BigDecimal.ZERO :
                previousReadings.stream()
                        .map(MeterReading::getReadingValue)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        String trend = calculateTrend(current, previous);

        return new DashboardSummaryDTO.MetricData(
                current.setScale(2, RoundingMode.HALF_UP),
                previous.setScale(2, RoundingMode.HALF_UP),
                trend,
                unit,
                icon
        );
    }

    private DashboardSummaryDTO.MetricData createDefaultMetric(BigDecimal value, String unit, String icon) {
        return new DashboardSummaryDTO.MetricData(value, value, "0.0", unit, icon);
    }

    private String calculateTrend(BigDecimal current, BigDecimal previous) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return "0.0";
        }

        BigDecimal difference = current.subtract(previous);
        BigDecimal percentage = difference
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        return (percentage.compareTo(BigDecimal.ZERO) > 0 ? "+" : "") +
                percentage.setScale(1, RoundingMode.HALF_UP).toString();
    }

    private DashboardSummaryDTO.BillingData getBillingData(Long userId, Meter waterMeter, Meter electricityMeter) {
        List<Bill> pendingBills = billRepository.findByUserIdAndStatus(userId, Bill.BillStatus.PENDING);

        BigDecimal totalAmount = pendingBills.stream()
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDate dueDate = pendingBills.stream()
                .map(Bill::getDueDate)
                .max(LocalDate::compareTo)
                .orElse(LocalDate.now().plusMonths(1));

        // Calculate breakdown
        BigDecimal waterAmount = BigDecimal.ZERO;
        BigDecimal electricityAmount = BigDecimal.ZERO;

        for (Bill bill : pendingBills) {
            if (waterMeter != null && bill.getMeterId().equals(waterMeter.getId())) {
                waterAmount = waterAmount.add(bill.getAmount());
            } else if (electricityMeter != null && bill.getMeterId().equals(electricityMeter.getId())) {
                electricityAmount = electricityAmount.add(bill.getAmount());
            }
        }

        DashboardSummaryDTO.BillBreakdown breakdown = new DashboardSummaryDTO.BillBreakdown(
                waterAmount.setScale(2, RoundingMode.HALF_UP),
                electricityAmount.setScale(2, RoundingMode.HALF_UP)
        );

        return new DashboardSummaryDTO.BillingData(
                totalAmount.setScale(2, RoundingMode.HALF_UP),
                dueDate.toString(),
                pendingBills.isEmpty() ? "paid" : "pending",
                breakdown,
                "💰"
        );
    }

    private List<DashboardSummaryDTO.DailyConsumption> getWeeklyConsumption(Meter waterMeter, Meter electricityMeter) {
        List<DashboardSummaryDTO.DailyConsumption> weeklyData = new ArrayList<>();
        String[] days = {"Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"};

        LocalDateTime now = LocalDateTime.now();

        for (int i = 6; i >= 0; i--) {
            LocalDateTime dayStart = now.minusDays(i).withHour(0).withMinute(0);
            LocalDateTime dayEnd = dayStart.plusDays(1);

            BigDecimal waterConsumption = BigDecimal.ZERO;
            BigDecimal electricityConsumption = BigDecimal.ZERO;

            if (waterMeter != null) {
                waterConsumption = getDailyConsumption(waterMeter.getId(), dayStart, dayEnd);
            }

            if (electricityMeter != null) {
                electricityConsumption = getDailyConsumption(electricityMeter.getId(), dayStart, dayEnd);
            }

            weeklyData.add(new DashboardSummaryDTO.DailyConsumption(
                    days[6 - i],
                    waterConsumption.setScale(1, RoundingMode.HALF_UP),
                    electricityConsumption.setScale(0, RoundingMode.HALF_UP)
            ));
        }

        return weeklyData;
    }

    private BigDecimal getDailyConsumption(Long meterId, LocalDateTime start, LocalDateTime end) {
        List<MeterReading> readings = meterReadingRepository.findRecentReadings(meterId, start);

        return readings.stream()
                .filter(r -> r.getReadingDate().isBefore(end))
                .map(MeterReading::getReadingValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private List<DashboardSummaryDTO.AlertData> getAlerts(Long userId) {
        List<Notification> notifications = notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);

        return notifications.stream()
                .limit(5)
                .map(this::convertToAlertData)
                .collect(Collectors.toList());
    }

    private DashboardSummaryDTO.AlertData convertToAlertData(Notification notification) {
        String type = notification.getType().name().toLowerCase();
        String icon = getIconForType(notification.getType());
        String color = getColorForType(notification.getType());

        long hoursAgo = ChronoUnit.HOURS.between(notification.getCreatedAt(), LocalDateTime.now());
        String timestamp = hoursAgo < 1 ? "Il y a quelques minutes" :
                hoursAgo < 24 ? "Il y a " + hoursAgo + " heures" :
                        "Il y a " + (hoursAgo / 24) + " jours";

        return new DashboardSummaryDTO.AlertData(
                notification.getId(),
                type,
                icon,
                notification.getTitle(),
                notification.getMessage(),
                timestamp,
                color
        );
    }

    private String getIconForType(Notification.NotificationType type) {
        return switch (type) {
            case ALERT -> "⚠️";
            case BILLING -> "📄";
            case CLAIM -> "📝";
            default -> "💧";
        };
    }

    private String getColorForType(Notification.NotificationType type) {
        return switch (type) {
            case ALERT -> "#fbbf24";
            case BILLING -> "#10b981";
            case CLAIM -> "#3b82f6";
            default -> "#6b7280";
        };
    }

    private DashboardSummaryDTO.UserInfo getUserInfo(Long userId, List<Meter> meters) {
        String accountNumber = "TET-2024-" + String.format("%05d", userId);
        String address = meters.isEmpty() ? "Non défini" :
                meters.get(0).getLocationAddress() != null ?
                meters.get(0).getLocationAddress() : "Non défini";

        Optional<User> userOptional = userRepository.findById(userId);
        String role = userOptional.map(user -> user.getRole().name()).orElse("CITOYEN");

        return new DashboardSummaryDTO.UserInfo(accountNumber, address, role);
    }
}
