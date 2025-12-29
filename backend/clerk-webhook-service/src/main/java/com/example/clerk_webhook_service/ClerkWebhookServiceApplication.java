package com.example.clerk_webhook_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients 
public class  ClerkWebhookServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClerkWebhookServiceApplication.class, args);
	}

}
