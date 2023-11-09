package com.payment.Service;

import com.payment.DAO.PaymentDAO;
import com.payment.DTO.PaymentDTO;
import com.payment.DTO.ResponseDTO;
import com.payment.DTO.PaymentResponseDTO;
import com.payment.DTO.SimpleResponseDTO;
import com.payment.Entity.PaymentEntity;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService{
    private final PaymentDAO paymentDAO;

    public PaymentServiceImpl(@Autowired PaymentDAO paymentDAO) {
        this.paymentDAO = paymentDAO;
    }

    @Override
    public SimpleResponseDTO createPayment(PaymentEntity paymentEntity) {
        return null;
    }

    @Override
    public ResponseDTO readPaymentByStoreId(Long StoreId) {
        return null;
    }

    @Override
    public ResponseDTO readPaymentByPurchaser(String purchaser) {
        return null;
    }

    @Override
    public SimpleResponseDTO updatePayment(PaymentEntity paymentEntity) {
        return null;
    }

    @Override
    public SimpleResponseDTO deletePayment(Long paymentId) {
        return null;
    }

    public PaymentEntity toEntity(@NotNull PaymentDTO paymentDTO) {
        PaymentEntity paymentEntity = PaymentEntity.builder()
                .paymentId(paymentDTO.getPaymentId())
                .storeId(paymentDTO.getStoreId())
                .productId(paymentDTO.getProductId())
                .purchaser(paymentDTO.getPurchaser())
                .price(paymentDTO.getPrice())
                .build();

        return paymentEntity;
    }

    public SimpleResponseDTO toSimpleResponseDTO(@NotNull Map<String, Object> resultMap) {
        SimpleResponseDTO simpleResponseDTO;

        simpleResponseDTO = SimpleResponseDTO.builder()
                .result((String) resultMap.get("result"))
                .message((String) resultMap.get("message"))
                .build();

        return simpleResponseDTO;
    }

    public ResponseDTO toResponseDTO(@NotNull Map<String, Object> resultMap){
        ResponseDTO responseDTO;

        if (resultMap.containsKey("data")){
            PaymentEntity paymentEntity = (PaymentEntity) resultMap.get("data");

            PaymentResponseDTO paymentResponseDTO = PaymentResponseDTO.builder()
                    .paymentId(paymentEntity.getPaymentId())
                    .storeId(paymentEntity.getStoreId())
                    .productId(paymentEntity.getProductId())
                    .purchaser(paymentEntity.getPurchaser())
                    .price(paymentEntity.getPrice())
                    .dateTime(paymentEntity.getDateTime())
                    .build();

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(paymentResponseDTO)
                    .build();
        } else if(resultMap.containsKey("dataList")){
            List<PaymentEntity> paymentEntities = (List<PaymentEntity>) resultMap.get("dataList");
            List<PaymentResponseDTO> paymentResponseDTOS = new ArrayList<>();

            for (PaymentEntity paymentEntity : paymentEntities) {
                PaymentResponseDTO paymentResponseDTO = PaymentResponseDTO.builder()
                        .paymentId(paymentEntity.getPaymentId())
                        .storeId(paymentEntity.getStoreId())
                        .productId(paymentEntity.getProductId())
                        .purchaser(paymentEntity.getPurchaser())
                        .price(paymentEntity.getPrice())
                        .dateTime(paymentEntity.getDateTime())
                        .build();
                paymentResponseDTOS.add(paymentResponseDTO);
            }

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(paymentResponseDTOS)
                    .build();
        } else{
            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .message((String) resultMap.get("message"))
                    .data(null)
                    .build();
        }

        return responseDTO;
    }

}
