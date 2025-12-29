package com.smartcity.traffic.kafka;

import com.smartcity.traffic.repository.IncidentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.TestPropertySource;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.fail;

@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = {"claims.traffic"})
@TestPropertySource(properties = {
        "spring.kafka.bootstrap-servers=${spring.embedded.kafka.brokers}",
        "spring.kafka.consumer.auto-offset-reset=earliest",
        "spring.kafka.consumer.group-id=test-group"
})
public class ClaimsConsumerIntegrationTest {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private IncidentRepository repo;

    @Test
    public void whenMessageProduced_thenPersisted() throws Exception {
        String messageId = UUID.randomUUID().toString();
        String json = String.format(
                "{\n" +
                "  \"messageId\": \"%s\",\n" +
                "  \"claimNumber\": \"CLM-TEST-1\",\n" +
                "  \"claim\": {\n" +
                "    \"serviceType\": \"water\",\n" +
                "    \"title\": \"Test\",\n" +
                "    \"description\": \"desc\",\n" +
                "    \"location\": {\"address\": \"123\", \"latitude\": 35.0, \"longitude\": -5.0},\n" +
                "    \"attachments\": []\n" +
                "  }\n" +
                "}", messageId);

        kafkaTemplate.send("claims.traffic", json);

        // wait up to ~5s
        for (int i = 0; i < 50; i++) {
            if (repo.existsByMessageId(messageId)) {
                return; // success
            }
            Thread.sleep(100);
        }
        fail("Message was not processed and persisted to DB");
    }
}
