package com.smartcity.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimInfo {
    private String serviceType;      // "water", "electricity", "wem"
    private String title;
    private String description;
    private String priority;         // "low", "medium", "high"
    private LocationInfo location;
    private List<AttachmentInfo> attachments;
    private Map<String, Object> extraData;  // meterNumber, accountNumber, etc.
}
