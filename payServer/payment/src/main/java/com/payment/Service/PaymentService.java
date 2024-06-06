package com.payment.Service;

import com.payment.DTO.*;
import com.payment.Entity.Order;

import java.util.List;

public interface PaymentService {
    public SimpleResponseDTO createImportPayment(PaymentRequestDTO request);
    public SimpleResponseDTO createPayment(Order order, String paymentUid);
    public ResponseDTO readPaymentByStoreId(Long storeId);
    public ResponseDTO readPaymentByPurchaser(String purchaser);
    public SimpleResponseDTO updatePayment(TotalPaymentDTO totalPaymentDTO);
    public SimpleResponseDTO deletePayment(Long paymentId);
}
