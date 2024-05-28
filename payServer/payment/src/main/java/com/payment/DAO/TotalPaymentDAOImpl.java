package com.payment.DAO;

import com.payment.Entity.Payment;
import com.payment.Entity.TotalPayment;
import com.payment.Repository.TotalPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

@Repository
public class TotalPaymentDAOImpl implements TotalPaymentDAO {
    private final TotalPaymentRepository totalPaymentRepository;

    public TotalPaymentDAOImpl(@Autowired TotalPaymentRepository totalPaymentRepository) {
        this.totalPaymentRepository = totalPaymentRepository;
    }

    @Override
    public Map<String, Object> createTotalPayment(TotalPayment totalPayment) {
        Map<String, Object> result = new HashMap<>();

        if(totalPaymentRepository.existsByTotalPaymentId(totalPayment.getTotalPaymentId())){
           result.put("result", "fail");
           result.put("message", "해당하는 TotalPayment가 DB에 존재합니다.");
           return result;
        }

        totalPayment.setDateTime(LocalDateTime.now());
        totalPaymentRepository.save(totalPayment);

        if(totalPaymentRepository.existsByTotalPaymentId(totalPayment.getTotalPaymentId())){
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

        List<TotalPayment> totalPaymentEntities = totalPaymentRepository.findByPurchaser(purchaser);

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
    public List<Payment> readPaymentById(Long paymentId) {
        TotalPayment totalPayment = totalPaymentRepository.findByTotalPaymentId(paymentId);
        return totalPayment.getPayments();
    }

    @Override
    public Map<String, Object> updateTotalPayment(TotalPayment totalPayment) {
        Map<String, Object> result = new HashMap<>();
        TotalPayment oldTotalPayment = totalPaymentRepository.findByTotalPaymentId(totalPayment.getTotalPaymentId());

        if (oldTotalPayment != null) {
            oldTotalPayment.setTotalPaymentId(totalPayment.getTotalPaymentId());
            oldTotalPayment.setPurchaser(totalPayment.getPurchaser());
            oldTotalPayment.setTotalPrice(totalPayment.getTotalPrice());
            oldTotalPayment.setDateTime(totalPayment.getDateTime());

            // 더 효과적인 방법으로 컬렉션 업데이트
            if (totalPayment.getPayments() != null) {
                oldTotalPayment.getPayments().clear();
                totalPaymentRepository.save(oldTotalPayment);

                oldTotalPayment.getPayments().addAll(totalPayment.getPayments());
//                for (Payment payment : totalPayment.getPayments()) {
//                    payment.setTotalPayment(oldTotalPayment);
//                }
            }

            totalPaymentRepository.save(oldTotalPayment);
            result.put("result", "success");
        } else {
            result.put("result", "fail");
        }

        return result;
    }

    @Override
    public Map<String, Object> deleteTotalPayment(Long paymentId) {
        Map<String, Object> result = new HashMap<>();

        TotalPayment totalPayment = totalPaymentRepository.findByTotalPaymentId(paymentId);

        if(totalPayment == null){
            result.put("result", "fail");
            result.put("message", "해당하는 TotalPayment가 DB에 존재하지 않습니다.");
            return result;
        }

        totalPaymentRepository.delete(totalPayment);

        if(totalPaymentRepository.existsByTotalPaymentId(paymentId)){
            result.put("result", "fail");
            result.put("message", "TotalPayment가 정상적으로 삭제되지 않았습니다.");
        } else{
            result.put("result", "success");
        }

        return result;
    }
}
