package com.payment.DAO;

import com.payment.Entity.Payment;
import com.payment.Repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PaymentDAOImpl implements PaymentDAO{
    private final PaymentRepository paymentRepository;

    public PaymentDAOImpl(@Autowired PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Map<String, Object> createPayment(Payment payment) {
        Map<String, Object> result = new HashMap<>();

        if(paymentRepository.existsByPaymentId(payment.getPaymentId())){
            result.put("result", "fail");
            result.put("message", "해당하는 Payment가 DB에 존재합니다.");
            return result;
        }

        payment.setDateTime(LocalDateTime.now());
        paymentRepository.save(payment);

        if(paymentRepository.existsByPaymentId(payment.getPaymentId())){
            result.put("result", "success");
            result.put("data", paymentRepository.findByPaymentId(payment.getPaymentId()));
        } else{
            result.put("result", "fail");
            result.put("message", "Payment가 정상적으로 저장되지 않았습니다.");
        }

        return result;
    }

    @Override
    public Map<String, Object> readPaymentByStoreId(Long storeId) {
        Map<String, Object> result = new HashMap<>();

        List<Payment> paymentEntities = paymentRepository.findByStoreId(storeId);

        if(!paymentEntities.isEmpty()){
            result.put("result", "success");
            result.put("dataList", paymentEntities);
        } else{
            result.put("result", "fail");
            result.put("message", "해당 상점의 결제 내역이 없습니다.");
        }
        return result;
    }

    @Override
    public Map<String, Object> deletePayment(Payment payment) {
        Map<String, Object> result = new HashMap<>();
        Long paymentId = payment.getPaymentId();
        paymentRepository.delete(payment);
        paymentRepository.flush(); // 데이터베이스 동기화

        if(paymentRepository.existsByPaymentId(paymentId)){
            result.put("result", "fail");
            result.put("message", "Payment가 정상적으로 삭제되지 않았습니다.");
        } else{
            result.put("result", "success");
        }

        return result;
    }
}
