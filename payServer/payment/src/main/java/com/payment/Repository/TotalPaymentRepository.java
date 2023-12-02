package com.payment.Repository;

import com.payment.Entity.TotalPaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TotalPaymentRepository extends JpaRepository<TotalPaymentEntity, String> {
    public Boolean existsByTotalPaymentId(Long totalPaymentId);
    public TotalPaymentEntity findByTotalPaymentId(Long totalPaymentId);
    public List<TotalPaymentEntity> findByPurchaser(String purchaser);
}
