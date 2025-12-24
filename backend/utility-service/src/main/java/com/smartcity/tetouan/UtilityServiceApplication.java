package com.smartcity.tetouan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableDiscoveryClient
@EnableJpaRepositories("com.smartcity.tetouan.repository")
@EntityScan("com.smartcity.tetouan.model")
public class UtilityServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UtilityServiceApplication.class, args);
    }
}
