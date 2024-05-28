package com.payment.DAO;

import com.payment.Entity.Payment;
import java.util.Map;

public interface PaymentDAO {
    public Map<String, Object> createPayment(Payment payment);
    public Map<String, Object> readPaymentByStoreId(Long storeId);
    public Map<String, Object> deletePayment(Payment payment);
}
