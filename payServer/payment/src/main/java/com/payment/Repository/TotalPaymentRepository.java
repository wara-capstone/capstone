package com.payment.Repository;

import com.payment.Entity.TotalPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TotalPaymentRepository extends JpaRepository<TotalPayment, String> {
    public Boolean existsByTotalPaymentId(Long totalPaymentId);
    public TotalPayment findByTotalPaymentId(Long totalPaymentId);
    public List<TotalPayment> findByPurchaser(String purchaser);
}
