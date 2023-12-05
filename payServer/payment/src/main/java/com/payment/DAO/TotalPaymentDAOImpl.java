package com.payment.DAO;

import com.payment.Entity.PaymentEntity;
import com.payment.Entity.TotalPaymentEntity;
import com.payment.Repository.TotalPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Repository
public class TotalPaymentDAOImpl implements TotalPaymentDAO {
    private final TotalPaymentRepository totalPaymentRepository;

    public TotalPaymentDAOImpl(@Autowired TotalPaymentRepository totalPaymentRepository) {
        this.totalPaymentRepository = totalPaymentRepository;
    }

    @Override
    public Map<String, Object> createTotalPayment(TotalPaymentEntity totalPaymentEntity) {
        Map<String, Object> result = new HashMap<>();

        if(totalPaymentRepository.existsByTotalPaymentId(totalPaymentEntity.getTotalPaymentId())){
           result.put("result", "fail");
           result.put("message", "해당하는 TotalPayment가 DB에 존재합니다.");
           return result;
        }

        totalPaymentEntity.setDateTime(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
        totalPaymentRepository.save(totalPaymentEntity);

        if(totalPaymentRepository.existsByTotalPaymentId(totalPaymentEntity.getTotalPaymentId())){
            result.put("result", "success");
        } else{
            result.put("result", "fail");
            result.put("message", "TotalPayment가 정상적으로 저장되지 않았습니다.");
        }

        return result;
    }

    @Override
    public Map<String, Object> readTotalPaymentByPurchaser(String purchaser) {
        Map<String, Object> result = new HashMap<>();

        List<TotalPaymentEntity> totalPaymentEntities = totalPaymentRepository.findByPurchaser(purchaser);

        if(!totalPaymentEntities.isEmpty()){
            result.put("result", "success");
            result.put("dataList", totalPaymentEntities);
        } else{
            result.put("result", "fail");
            result.put("message", "해당 고객의 결제 내역이 없습니다.");
        }
        return result;
    }

    @Override
    public List<PaymentEntity> readPaymentById(Long paymentId) {
        TotalPaymentEntity totalPaymentEntity = totalPaymentRepository.findByTotalPaymentId(paymentId);
        return totalPaymentEntity.getPayments();
    }

    @Override
    public Map<String, Object> updateTotalPayment(TotalPaymentEntity totalPaymentEntity) {
        Map<String, Object> result = new HashMap<>();
        TotalPaymentEntity oldTotalPaymentEntity = totalPaymentRepository.findByTotalPaymentId(totalPaymentEntity.getTotalPaymentId());

        if (oldTotalPaymentEntity != null) {
            oldTotalPaymentEntity.setTotalPaymentId(totalPaymentEntity.getTotalPaymentId());
            oldTotalPaymentEntity.setPurchaser(totalPaymentEntity.getPurchaser());
            oldTotalPaymentEntity.setTotalPrice(totalPaymentEntity.getTotalPrice());
            oldTotalPaymentEntity.setDateTime(totalPaymentEntity.getDateTime());

            // 더 효과적인 방법으로 컬렉션 업데이트
            if (totalPaymentEntity.getPayments() != null) {
                oldTotalPaymentEntity.getPayments().clear();
                totalPaymentRepository.save(oldTotalPaymentEntity);

                oldTotalPaymentEntity.getPayments().addAll(totalPaymentEntity.getPayments());
                for (PaymentEntity payment : totalPaymentEntity.getPayments()) {
                    payment.setTotalPaymentEntity(oldTotalPaymentEntity);
                }
            }

            totalPaymentRepository.save(oldTotalPaymentEntity);
            result.put("result", "success");
        } else {
            result.put("result", "fail");
        }

        return result;
    }

    @Override
    public Map<String, Object> deleteTotalPayment(Long paymentId) {
        Map<String, Object> result = new HashMap<>();

        TotalPaymentEntity totalPaymentEntity = totalPaymentRepository.findByTotalPaymentId(paymentId);

        if(totalPaymentEntity == null){
            result.put("result", "fail");
            result.put("message", "해당하는 TotalPayment가 DB에 존재하지 않습니다.");
            return result;
        }

        totalPaymentRepository.delete(totalPaymentEntity);

        if(totalPaymentRepository.existsByTotalPaymentId(paymentId)){
            result.put("result", "fail");
            result.put("message", "TotalPayment가 정상적으로 삭제되지 않았습니다.");
        } else{
            result.put("result", "success");
        }

        return result;
    }
}
