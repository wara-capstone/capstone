package com.payment.DAO;

import com.payment.Entity.Payment;
import com.payment.Entity.TotalPayment;

import java.util.List;
import java.util.Map;

public interface TotalPaymentDAO {
    public Map<String, Object> createTotalPayment(TotalPayment totalPayment);
    public Map<String, Object> readTotalPaymentByPurchaser(String purchaser);
    public List<Payment> readPaymentById(Long paymentId);
    public Map<String, Object> updateTotalPayment(TotalPayment totalPayment);
    public Map<String, Object> deleteTotalPayment(Long paymentId);
}
