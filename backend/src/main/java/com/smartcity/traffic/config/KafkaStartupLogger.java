package com.smartcity.traffic.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class KafkaStartupLogger {

    private static final Logger log = LoggerFactory.getLogger(KafkaStartupLogger.class);

    private final Environment env;

    @Value("${spring.kafka.bootstrap-servers:#{null}}")
    private String springBootstrap;

    public KafkaStartupLogger(Environment env) {
        this.env = env;
    }

    @PostConstruct
    public void logBootstrap() {
        String kafkaBootstrapEnv = env.getProperty("KAFKA_BOOTSTRAP");
        String springProp = env.getProperty("spring.kafka.bootstrap-servers");

        log.info("[KafkaStartup] env KAFKA_BOOTSTRAP='{}', env SPRING_KAFKA_BOOTSTRAP_SERVERS='{}', spring.kafka.bootstrap-servers='{}', @Value='{}'",
                kafkaBootstrapEnv,
                env.getProperty("SPRING_KAFKA_BOOTSTRAP_SERVERS"),
                springProp,
                springBootstrap);

        if (springBootstrap != null && springBootstrap.contains("redpanda")) {
            log.warn("[KafkaStartup] Detected 'redpanda' in configured bootstrap servers. If running locally (not in docker), set KAFKA_BOOTSTRAP or --spring.kafka.bootstrap-servers=localhost:9092 to connect to host-mapped broker.");
        }
    }
}