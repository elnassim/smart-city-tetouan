package com.smartcity.tetouan.repository;

import com.smartcity.tetouan.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByUserId(Long userId);
    List<Bill> findByUserIdAndStatus(Long userId, Bill.BillStatus status);

    @Query("SELECT SUM(b.amount) FROM Bill b WHERE b.userId = :userId AND b.status = :status")
    Double getTotalAmountByUserAndStatus(@Param("userId") Long userId, @Param("status") Bill.BillStatus status);
}
