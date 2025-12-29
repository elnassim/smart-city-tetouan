package com.smartcity.traffic.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class SensorConsumer {

    private final ObjectMapper mapper = new ObjectMapper();
    private final KafkaTemplate<String, String> kafkaTemplate;

    public SensorConsumer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "sensors.traffic", groupId = "traffic-service")
    public void onMessage(String raw) {
        try {
            JsonNode msg = mapper.readTree(raw);
            double avgSpeed = msg.path("avgSpeed").asDouble(Double.NaN);
            int vehicleCount = msg.path("vehicleCount").asInt(-1);

            boolean congestion = false;
            if (!Double.isNaN(avgSpeed) && avgSpeed < 20) congestion = true;
            if (vehicleCount > 100) congestion = true;

            if (congestion) {
                String alert = mapper.createObjectNode()
                    .put("type", "CONGESTION_DETECTED")
                    .put("segmentId", msg.path("segmentId").asText("unknown"))
                    .put("avgSpeed", avgSpeed)
                    .put("vehicleCount", vehicleCount)
                    .put("timestamp", java.time.Instant.now().toString())
                    .toString();

                kafkaTemplate.send("events.alerts", msg.path("segmentId").asText("unknown"), alert);
            }
        } catch (Exception e) {
          
        }
    }
}
