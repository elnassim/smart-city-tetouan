package com.smartcity.tetouan.repository;

import com.smartcity.tetouan.model.MeterReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MeterReadingRepository extends JpaRepository<MeterReading, Long> {
    List<MeterReading> findByMeterIdOrderByReadingDateDesc(Long meterId);

    @Query("SELECT mr FROM MeterReading mr WHERE mr.meterId = :meterId AND mr.readingDate >= :startDate ORDER BY mr.readingDate DESC")
    List<MeterReading> findRecentReadings(@Param("meterId") Long meterId, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT mr FROM MeterReading mr WHERE mr.meterId = :meterId ORDER BY mr.readingDate DESC LIMIT 1")
    MeterReading findLatestReading(@Param("meterId") Long meterId);
}
