package com.example.clerk_webhook_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableFeignClients
@EnableJpaRepositories("com.example.clerk_webhook_service.repository")
@EntityScan("com.example.clerk_webhook_service.model")
public class ClerkWebhookServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClerkWebhookServiceApplication.class, args);
	}
}
