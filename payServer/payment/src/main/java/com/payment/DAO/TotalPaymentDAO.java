package com.payment.DAO;

import com.payment.Entity.PaymentEntity;
import com.payment.Entity.TotalPaymentEntity;

import java.util.List;
import java.util.Map;

public interface TotalPaymentDAO {
    public Map<String, Object> createTotalPayment(TotalPaymentEntity totalPaymentEntity);
    public Map<String, Object> readTotalPaymentByPurchaser(String purchaser);
    public List<PaymentEntity> readPaymentById(Long paymentId);
    public Map<String, Object> updateTotalPayment(TotalPaymentEntity totalPaymentEntity);
    public Map<String, Object> deleteTotalPayment(Long paymentId);
}
