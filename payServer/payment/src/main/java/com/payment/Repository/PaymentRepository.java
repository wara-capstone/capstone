package com.payment.Repository;

import com.payment.Entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<PaymentEntity, String> {
    public Boolean exitsByPaymentId(Long paymentId);
    public List<PaymentEntity> findByStoreId(Long storeId);
    public List<PaymentEntity> findByPurchaser(String purchaser);
    public Boolean deleteByPaymentId(Long paymentId);
}
