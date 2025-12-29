package com.smartcity.traffic.config;

import com.smartcity.traffic.security.JwtAuthFilter;
import com.smartcity.traffic.security.JwtVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Value("${clerk.jwks.url:}")
    private String jwksUrl;

    @Value("${dev.skip.jwt.verify:true}")
    private boolean skipVerification;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        JwtVerifier verifier = null;
        if (!skipVerification && jwksUrl != null && !jwksUrl.isBlank()) {
            verifier = new JwtVerifier(jwksUrl);
        }

        JwtAuthFilter jwtFilter = new JwtAuthFilter(verifier, skipVerification);

        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/**", "/health", "/swagger-ui/**", "/v3/api-docs/**", "/sign-in", "/sign-up", "/api/clerk/webhook").permitAll()
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            ;

        return http.build();
    }
}
