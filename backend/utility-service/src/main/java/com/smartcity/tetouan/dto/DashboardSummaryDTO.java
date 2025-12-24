package com.smartcity.tetouan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private ConsumptionData consumption;
    private BillingData billing;
    private List<DailyConsumption> weeklyConsumption;
    private List<AlertData> alerts;
    private UserInfo user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConsumptionData {
        private MetricData water;
        private MetricData electricity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetricData {
        private BigDecimal current;
        private BigDecimal previous;
        private String trend;
        private String unit;
        private String icon;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillingData {
        private BigDecimal totalAmount;
        private String dueDate;
        private String status;
        private BillBreakdown breakdown;
        private String icon;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillBreakdown {
        private BigDecimal water;
        private BigDecimal electricity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyConsumption {
        private String day;
        private BigDecimal water;
        private BigDecimal electricity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlertData {
        private Long id;
        private String type;
        private String icon;
        private String title;
        private String message;
        private String timestamp;
        private String color;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private String accountNumber;
        private String address;
        private String role;

        public UserInfo(String accountNumber, String address) {
            this.accountNumber = accountNumber;
            this.address = address;
        }
    }
}
