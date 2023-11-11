package com.payment.Repository;

import com.payment.Entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, String> {
    public List<PaymentEntity> findByStoreId(Long storeId);
    public PaymentEntity findByPaymentId(Long paymentId);
    public Boolean existsByPaymentId(Long paymentId);
    public Boolean removeByPaymentId(Long paymentId);
}
