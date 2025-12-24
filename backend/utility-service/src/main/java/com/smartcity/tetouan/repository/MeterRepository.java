package com.smartcity.tetouan.repository;

import com.smartcity.tetouan.model.Meter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeterRepository extends JpaRepository<Meter, Long> {
    List<Meter> findByUserId(Long userId);
    List<Meter> findByUserIdAndType(Long userId, Meter.MeterType type);
}
