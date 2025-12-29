package com.smartcity.traffic.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic sensorsTopic() {
        return TopicBuilder.name("sensors.traffic").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic alertsTopic() {
        return TopicBuilder.name("events.alerts").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic claimsTopic() {
        // Topic for incoming claims/reports produced by citizens
        return TopicBuilder.name("claims.traffic").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic claimsStatusUpdatesTopic() {
        return TopicBuilder.name("claims.status-updates").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic claimsResponsesTopic() {
        return TopicBuilder.name("claims.responses").partitions(3).replicas(1).build();
    }
}
