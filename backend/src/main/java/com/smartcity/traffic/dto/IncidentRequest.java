package com.smartcity.traffic.dto;

import java.util.List;
import java.util.Map;

public class IncidentRequest {
    public String messageId;
    public String messageType;
    public String timestamp;
    public String version;
    public String claimId;
    public String claimNumber;
    public String correlationId;
    public UserInfo user;
    public ClaimData claim;

    public static class UserInfo {
        public String id;
        public String email;
        public String name;
        public String phone;
    }

    public static class ClaimData {
        public String serviceType;
        public String title;
        public String description;
        public String priority;
        public Location location;
        public List<Attachment> attachments;
        public Map<String, Object> extraData;
    }

    public static class Location {
        public String address;
        public Double latitude;
        public Double longitude;
    }

    public static class Attachment {
        public String url;
        public String fileName;
        public String fileType;
    }
}
