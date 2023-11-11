package com.payment.Service;

import com.payment.DTO.PaymentDTO;
import com.payment.DTO.TotalPaymentDTO;
import com.payment.DTO.ResponseDTO;
import com.payment.DTO.SimpleResponseDTO;

import java.util.List;

public interface PaymentService {
    public SimpleResponseDTO createPayment(TotalPaymentDTO totalPaymentDTO, List<PaymentDTO> paymentDTOS);
    public ResponseDTO readPaymentByStoreId(Long storeId);
    public ResponseDTO readPaymentByPurchaser(String purchaser);
    public SimpleResponseDTO updatePayment(TotalPaymentDTO totalPaymentDTO);
    public SimpleResponseDTO deletePayment(Long paymentId);
}
