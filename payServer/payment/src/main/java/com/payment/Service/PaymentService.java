package com.payment.Service;

import com.payment.DTO.ResponseDTO;
import com.payment.DTO.SimpleResponseDTO;
import com.payment.Entity.PaymentEntity;

import java.util.Map;

public interface PaymentService {
    public SimpleResponseDTO createPayment(PaymentEntity paymentEntity);
    public ResponseDTO readPaymentByStoreId(Long StoreId);
    public ResponseDTO readPaymentByPurchaser(String purchaser);
    public SimpleResponseDTO updatePayment(PaymentEntity paymentEntity);
    public SimpleResponseDTO deletePayment(Long paymentId);
}
