package com.payment.DAO;

import com.payment.Entity.PaymentEntity;
import com.payment.Repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.ZoneId;
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
    public Map<String, Object> createPayment(PaymentEntity paymentEntity) {
        Map<String, Object> result = new HashMap<>();

        if(paymentRepository.existsByPaymentId(paymentEntity.getPaymentId())){
            result.put("result", "fail");
            result.put("message", "해당하는 Payment가 DB에 존재합니다.");
            return result;
        }

        paymentEntity.setDateTime(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
        paymentRepository.save(paymentEntity);

        if(paymentRepository.existsByPaymentId(paymentEntity.getPaymentId())){
            result.put("result", "success");
            result.put("data", paymentRepository.findByPaymentId(paymentEntity.getPaymentId()));
        } else{
            result.put("result", "fail");
            result.put("message", "Payment가 정상적으로 저장되지 않았습니다.");
        }

        return result;
    }

    @Override
    public Map<String, Object> readPaymentByStoreId(Long storeId) {
        Map<String, Object> result = new HashMap<>();

        List<PaymentEntity> paymentEntities = paymentRepository.findByStoreId(storeId);

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
    public Map<String, Object> deletePayment(PaymentEntity paymentEntity) {
        Map<String, Object> result = new HashMap<>();
        Long paymentId = paymentEntity.getPaymentId();
        paymentRepository.delete(paymentEntity);
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
