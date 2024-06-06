package com.payment.Repository;

import com.payment.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    public List<Payment> findByStoreId(Long storeId);
    public Payment findByPaymentId(Long paymentId);
    public Boolean existsByPaymentId(Long paymentId);
    public Boolean removeByPaymentId(Long paymentId);
}
