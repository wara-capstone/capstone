package com.payment.DAO;

import com.payment.Entity.PaymentEntity;

import java.util.Map;

public interface PaymentDAO {
    public Map<String, Object> createPayment(PaymentEntity paymentEntity);
    public Map<String, Object> readPaymentByStoreId(Long StoreId);
    public Map<String, Object> readPaymentByPurchaser(String purchaser);
    public Map<String, Object> updatePayment(PaymentEntity paymentEntity);
    public Map<String, Object> deletePayment(Long paymentId);
}
