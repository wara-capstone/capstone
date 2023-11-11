package com.payment.Service;

import com.payment.DAO.PaymentDAO;
import com.payment.DAO.TotalPaymentDAO;
import com.payment.DTO.*;
import com.payment.Entity.PaymentEntity;
import com.payment.Entity.TotalPaymentEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final TotalPaymentDAO totalPaymentDAO;
    private final static Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);
    private final PaymentDAO paymentDAO;

    public PaymentServiceImpl(@Autowired TotalPaymentDAO totalPaymentDAO,
                              @Autowired PaymentDAO paymentDAO) {
        this.totalPaymentDAO = totalPaymentDAO;
        this.paymentDAO = paymentDAO;
    }

    @Override
    public SimpleResponseDTO createPayment(TotalPaymentDTO totalPaymentDTO, List<PaymentDTO> paymentDTOS) {
        List<PaymentEntity> paymentEntities = new ArrayList<>();

        TotalPaymentEntity totalPaymentEntity = toTotalPaymentEntity(totalPaymentDTO, paymentEntities);
        Map<String, Object> resultMap = totalPaymentDAO.createTotalPayment(totalPaymentEntity);

        for(PaymentDTO paymentDTO : paymentDTOS){
            PaymentEntity paymentEntity = toPaymentEntity(paymentDTO);
            paymentEntity.setTotalPaymentEntity(totalPaymentEntity);
            Map<String, Object> paymentResult = paymentDAO.createPayment(paymentEntity);

            if(paymentResult.get("result").equals("fail")){
                return toSimpleResponseDTO(paymentResult);
            }

            paymentEntities.add((PaymentEntity) paymentResult.get("data"));
        }

        totalPaymentEntity.setPayments(paymentEntities);
        resultMap = totalPaymentDAO.updateTotalPayment(totalPaymentEntity);

        SimpleResponseDTO simpleResponseDTO = toSimpleResponseDTO(resultMap);
        return simpleResponseDTO;
    }

    @Override
    public ResponseDTO readPaymentByStoreId(Long storeId) {
        Map<String, Object> resultMap = paymentDAO.readPaymentByStoreId(storeId);
        ResponseDTO responseDTO = toPaymentResponseDTO(resultMap);
        return responseDTO;
    }

    @Override
    public ResponseDTO readPaymentByPurchaser(String purchaser) {
        Map<String, Object> resultMap = totalPaymentDAO.readTotalPaymentByPurchaser(purchaser);
        ResponseDTO responseDTO = toResponseDTO(resultMap);
        return responseDTO;
    }

    @Override
    public SimpleResponseDTO updatePayment(TotalPaymentDTO totalPaymentDTO) {
        return null;
    }

    @Override
    public SimpleResponseDTO deletePayment(Long totalPaymentId) {
        List<PaymentEntity> paymentEntities = totalPaymentDAO.readPaymentById(totalPaymentId);

        for(PaymentEntity paymentEntity : paymentEntities){
            Map<String, Object> paymentResult = paymentDAO.deletePayment(paymentEntity);

            if(paymentResult.get("result").equals("fail")){
                return toSimpleResponseDTO(paymentResult);
            }
        }

        Map<String, Object> resultMap = totalPaymentDAO.deleteTotalPayment(totalPaymentId);

        SimpleResponseDTO simpleResponseDTO = toSimpleResponseDTO(resultMap);
        return simpleResponseDTO;
    }

    public TotalPaymentEntity toTotalPaymentEntity(TotalPaymentDTO totalPaymentDTO, List<PaymentEntity> paymentEntities) {
        TotalPaymentEntity totalPaymentEntity = TotalPaymentEntity.builder()
                .totalPaymentId(totalPaymentDTO.getTotalPaymentId())
                .purchaser(totalPaymentDTO.getPurchaser())
                .totalPrice(totalPaymentDTO.getTotalPrice())
                .payments(paymentEntities)
                .build();

        return totalPaymentEntity;
    }

    public PaymentEntity toPaymentEntity(PaymentDTO paymentDTO) {
        PaymentEntity paymentEntity = PaymentEntity.builder()
                .paymentId(paymentDTO.getPaymentId())
                .storeId(paymentDTO.getStoreId())
                .productId(paymentDTO.getProductId())
                .optionId(paymentDTO.getOptionId())
                .price(paymentDTO.getPrice())
                .quantity(paymentDTO.getQuantity())
                .build();

        return paymentEntity;
    }

    public SimpleResponseDTO toSimpleResponseDTO(Map<String, Object> resultMap) {
        SimpleResponseDTO simpleResponseDTO;

        simpleResponseDTO = SimpleResponseDTO.builder()
                .result((String) resultMap.get("result"))
                .message((String) resultMap.get("message"))
                .build();

        return simpleResponseDTO;
    }

    public PaymentDTO toPaymentDTO(PaymentEntity paymentEntity){
        PaymentDTO paymentDTO = PaymentDTO.builder()
                .paymentId(paymentEntity.getPaymentId())
                .storeId(paymentEntity.getStoreId())
                .productId(paymentEntity.getProductId())
                .optionId(paymentEntity.getOptionId())
                .quantity(paymentEntity.getQuantity())
                .price(paymentEntity.getPrice())
                .dateTime(paymentEntity.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .build();

        return paymentDTO;
    }

    public List<PaymentDTO> toPaymentDTOS(List<PaymentEntity> paymentEntities){
        List<PaymentDTO> paymentDTOS = new ArrayList<>();

        for(PaymentEntity paymentEntity : paymentEntities){
            PaymentDTO paymentDTO = toPaymentDTO(paymentEntity);
            paymentDTOS.add(paymentDTO);
        }

        return paymentDTOS;
    }

    public ResponseDTO toResponseDTO(Map<String, Object> resultMap) {
        ResponseDTO responseDTO;

        if (resultMap.containsKey("data")) {
            TotalPaymentEntity totalPaymentEntity = (TotalPaymentEntity) resultMap.get("data");

            TotalPaymentDTO totalPaymentDTO = TotalPaymentDTO.builder()
                    .totalPaymentId(totalPaymentEntity.getTotalPaymentId())
                    .purchaser(totalPaymentEntity.getPurchaser())
                    .totalPrice(totalPaymentEntity.getTotalPrice())
                    .dateTime(totalPaymentEntity.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                    .paymentDTOS(toPaymentDTOS(totalPaymentEntity.getPayments()))
                    .build();

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(totalPaymentDTO)
                    .build();
        } else if (resultMap.containsKey("dataList")) {
            List<TotalPaymentEntity> totalPaymentEntities = (List<TotalPaymentEntity>) resultMap.get("dataList");
            List<TotalPaymentDTO> totalPaymentDTOS = new ArrayList<>();

            for (TotalPaymentEntity totalPaymentEntity : totalPaymentEntities) {
                TotalPaymentDTO totalPaymentDTO = TotalPaymentDTO.builder()
                        .totalPaymentId(totalPaymentEntity.getTotalPaymentId())
                        .purchaser(totalPaymentEntity.getPurchaser())
                        .totalPrice(totalPaymentEntity.getTotalPrice())
                        .dateTime(totalPaymentEntity.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                        .paymentDTOS(toPaymentDTOS(totalPaymentEntity.getPayments()))
                        .build();
                totalPaymentDTOS.add(totalPaymentDTO);
            }

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(totalPaymentDTOS)
                    .build();
        } else {
            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .message((String) resultMap.get("message"))
                    .data(null)
                    .build();
        }

        return responseDTO;
    }

    public ResponseDTO toPaymentResponseDTO(Map<String, Object> resultMap){
        ResponseDTO responseDTO;

        if (resultMap.containsKey("data")) {
            PaymentEntity paymentEntity = (PaymentEntity) resultMap.get("data");

            PaymentDTO paymentDTO = PaymentDTO.builder()
                    .paymentId(paymentEntity.getPaymentId())
                    .storeId(paymentEntity.getStoreId())
                    .productId(paymentEntity.getProductId())
                    .optionId(paymentEntity.getOptionId())
                    .price(paymentEntity.getPrice())
                    .quantity(paymentEntity.getQuantity())
                    .dateTime(paymentEntity.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                    .build();

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(paymentDTO)
                    .build();
        } else if (resultMap.containsKey("dataList")) {
            List<PaymentEntity> paymentEntities = (List<PaymentEntity>) resultMap.get("dataList");
            List<PaymentDTO> paymentDTOS = new ArrayList<>();

            for (PaymentEntity paymentEntity : paymentEntities) {
                PaymentDTO paymentDTO = PaymentDTO.builder()
                        .paymentId(paymentEntity.getPaymentId())
                        .storeId(paymentEntity.getStoreId())
                        .productId(paymentEntity.getProductId())
                        .optionId(paymentEntity.getOptionId())
                        .price(paymentEntity.getPrice())
                        .quantity(paymentEntity.getQuantity())
                        .dateTime(paymentEntity.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                        .build();
                paymentDTOS.add(paymentDTO);
            }

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(paymentDTOS)
                    .build();
        } else {
            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .message((String) resultMap.get("message"))
                    .data(null)
                    .build();
        }

        return responseDTO;
    }
}