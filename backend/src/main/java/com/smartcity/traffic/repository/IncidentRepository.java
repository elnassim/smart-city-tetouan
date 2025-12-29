package com.smartcity.traffic.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartcity.traffic.model.Incident;

public interface IncidentRepository extends JpaRepository<Incident, UUID> {
    boolean existsByMessageId(String messageId);
}
