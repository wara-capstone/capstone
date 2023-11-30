package com.payment.DAO;

import com.payment.Entity.PaymentEntity;

import java.util.Map;

public interface PaymentDAO {
    public Map<String, Object> createPayment(PaymentEntity paymentEntity);
    public Map<String, Object> readPaymentByStoreId(Long storeId);
    public Map<String, Object> deletePayment(PaymentEntity paymentEntity);
}
