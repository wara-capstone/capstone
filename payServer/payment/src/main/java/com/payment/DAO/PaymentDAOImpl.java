package com.payment.DAO;

import com.payment.Entity.PaymentEntity;
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
    public Map<String, Object> createPayment(PaymentEntity paymentEntity) {
        Map<String, Object> result = new HashMap<>();

        if(paymentRepository.exitsByPaymentId(paymentEntity.getPaymentId())){
           result.put("result", "fail");
           result.put("message", "해당하는 Payment가 DB에 존재합니다.");
           return result;
        }

        paymentEntity.setDateTime(LocalDateTime.now());
        paymentRepository.save(paymentEntity);

        if(paymentRepository.exitsByPaymentId(paymentEntity.getPaymentId())){
            result.put("result", "success");
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
        return null;
    }

    @Override
    public Map<String, Object> readPaymentByPurchaser(String purchaser) {
        Map<String, Object> result = new HashMap<>();

        List<PaymentEntity> paymentEntities = paymentRepository.findByPurchaser(purchaser);

        if(!paymentEntities.isEmpty()){
            result.put("result", "success");
            result.put("dataList", paymentEntities);
        } else{
            result.put("result", "fail");
            result.put("message", "해당 고객의 결제 내역이 없습니다.");
        }
        return null;
    }

    @Override
    public Map<String, Object> updatePayment(PaymentEntity paymentEntity) {
        Map<String, Object> result = new HashMap<>();

        return null;
    }

    @Override
    public Map<String, Object> deletePayment(Long paymentId) {
        Map<String, Object> result = new HashMap<>();

        if(!paymentRepository.exitsByPaymentId(paymentId)){
            result.put("result", "fail");
            result.put("message", "해당하는 Payment가 DB에 존재하지 않습니다.");
            return result;
        }

        paymentRepository.deleteByPaymentId(paymentId);

        if(paymentRepository.exitsByPaymentId(paymentId)){
            result.put("result", "fail");
            result.put("message", "Payment가 정상적으로 삭제되지 않았습니다.");
        } else{
            result.put("result", "success");
        }

        return result;
    }
}
