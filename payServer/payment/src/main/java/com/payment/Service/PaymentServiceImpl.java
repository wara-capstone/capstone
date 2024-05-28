package com.payment.Service;

import com.payment.DAO.PaymentDAO;
import com.payment.DAO.TotalPaymentDAO;
import com.payment.DTO.*;
import com.payment.Entity.Order;
import com.payment.Entity.OrderItem;
import com.payment.Entity.Payment;
import com.payment.Entity.TotalPayment;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.request.CancelData;
import com.siot.IamportRestClient.response.IamportResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {
    private final TotalPaymentDAO totalPaymentDAO;
    private final HttpCommunicationService httpCommunicationService;
    private final static Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);
    private final PaymentDAO paymentDAO;
    private final IamportClient iamportClient;
    private final OrderService orderService;

    @Autowired
    public PaymentServiceImpl(TotalPaymentDAO totalPaymentDAO,
                              PaymentDAO paymentDAO,
                              HttpCommunicationService httpCommunicationService,
                              OrderService orderService,
                              IamportClient iamportClient) {
        this.totalPaymentDAO = totalPaymentDAO;
        this.paymentDAO = paymentDAO;
        this.httpCommunicationService = httpCommunicationService;
        this.orderService = orderService;
        this.iamportClient = iamportClient;
    }

    @Override
    public SimpleResponseDTO createImportPayment(PaymentRequestDTO request) {
        try {
            // 결제 단건 조회(아임포트)
            IamportResponse<com.siot.IamportRestClient.response.Payment> iamportResponse = iamportClient.paymentByImpUid(request.getPaymentUid());
            // 주문내역 조회
            Order order = orderService.findByOrderId(request.getOrderUid());

            // 결제 완료가 아니면
            if(!iamportResponse.getResponse().getStatus().equals("paid")) {
                // 주문, 결제 삭제
                orderService.deleteOrder(order);

                throw new RuntimeException("결제 미완료");
            }

            // DB에 저장된 결제 금액
            Long price = order.getTotalPrice();
            // 실 결제 금액
            int iamportPrice = iamportResponse.getResponse().getAmount().intValue();

            // 결제 금액 검증
            if(iamportPrice != price) {
                // 주문 삭제
                orderService.deleteOrder(order);

                // 결제금액 위변조로 의심되는 결제금액을 취소(아임포트)
                iamportClient.cancelPaymentByImpUid(new CancelData(iamportResponse.getResponse().getImpUid(), true, new BigDecimal(iamportPrice)));

                throw new RuntimeException("결제금액 위변조 의심");
            }

            return createPayment(order, request.getPaymentUid());

        } catch (IamportResponseException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public SimpleResponseDTO createPayment(Order order, String paymentUid) {
        TotalPayment totalPayment = toTotalPaymentEntity(order, paymentUid);
        Map<String, Object> resultMap = totalPaymentDAO.createTotalPayment(totalPayment);

//        for(PaymentDTO paymentDTO : paymentDTOS){
//            Payment payment = toPaymentEntity(paymentDTO);
//            payment.setTotalPayment(totalPayment);
//            Map<String, Object> paymentResult = paymentDAO.createPayment(payment);
//
//            try {
//                httpCommunicationService.stockUpdate(payment.getProductId(), payment.getOptionId(), -payment.getQuantity());
//            } catch(URISyntaxException e){
//                e.getMessage();
//            }
//
//            if(paymentResult.get("result").equals("fail")){
//                return toSimpleResponseDTO(paymentResult);
//            }
//        }

//        for(Payment payment : totalPayment.getPayments()){
//            try {
//                httpCommunicationService.stockUpdate(payment.getProductId(), payment.getOptionId(), -payment.getQuantity());
//            } catch(URISyntaxException e){
//                e.getMessage();
//            }
//        }

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
        Map<String, Object> resultMap = totalPaymentDAO.deleteTotalPayment(totalPaymentId);

        SimpleResponseDTO simpleResponseDTO = toSimpleResponseDTO(resultMap);
        return simpleResponseDTO;
    }

    public TotalPayment toTotalPaymentEntity(Order order, String paymentUid) {
        return TotalPayment.builder()
                .purchaser(order.getPurchaser())
                .totalPrice(order.getTotalPrice())
                .paymentUid(paymentUid)
                .payments(toPaymentEntity(order.getOrderItemList(), order.getPurchaser()))
                .build();
    }

    public List<Payment> toPaymentEntity(List<OrderItem> orderItemList, String purchaser) {
        List<Payment> paymentList = new ArrayList<Payment>();

        for(OrderItem orderItem : orderItemList){
            Payment payment = Payment.builder()
                    .storeId(orderItem.getStoreId())
                    .productId(orderItem.getProductId())
                    .optionId(orderItem.getOptionId())
                    .price(orderItem.getPrice())
                    .quantity(orderItem.getQuantity())
                    .purchaser(purchaser)
                    .dateTime(LocalDateTime.now())
                    .build();

            paymentList.add(payment);
        }

        return paymentList;
    }

    public SimpleResponseDTO toSimpleResponseDTO(Map<String, Object> resultMap) {
        SimpleResponseDTO simpleResponseDTO;

        simpleResponseDTO = SimpleResponseDTO.builder()
                .result((String) resultMap.get("result"))
                .message((String) resultMap.get("message"))
                .build();

        return simpleResponseDTO;
    }

    public PaymentDTO toPaymentDTO(Payment payment){
        PaymentDTO paymentDTO = PaymentDTO.builder()
                .paymentId(payment.getPaymentId())
                .storeId(payment.getStoreId())
                .productId(payment.getProductId())
                .optionId(payment.getOptionId())
                .quantity(payment.getQuantity())
                .price(payment.getPrice())
                .dateTime(payment.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .build();

        return paymentDTO;
    }

    public List<PaymentDTO> toPaymentDTOS(List<Payment> paymentEntities){
        List<PaymentDTO> paymentDTOS = new ArrayList<>();

        for(Payment payment : paymentEntities){
            PaymentDTO paymentDTO = toPaymentDTO(payment);
            paymentDTOS.add(paymentDTO);
        }

        return paymentDTOS;
    }

    public ResponseDTO toResponseDTO(Map<String, Object> resultMap) {
        ResponseDTO responseDTO;

        if (resultMap.containsKey("data")) {
            TotalPayment totalPayment = (TotalPayment) resultMap.get("data");

            TotalPaymentDTO totalPaymentDTO = TotalPaymentDTO.builder()
                    .totalPaymentId(totalPayment.getTotalPaymentId())
                    .purchaser(totalPayment.getPurchaser())
                    .totalPrice(totalPayment.getTotalPrice())
                    .dateTime(totalPayment.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                    .paymentDTOS(toPaymentDTOS(totalPayment.getPayments()))
                    .build();

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(totalPaymentDTO)
                    .build();
        } else if (resultMap.containsKey("dataList")) {
            List<TotalPayment> totalPaymentEntities = (List<TotalPayment>) resultMap.get("dataList");
            List<TotalPaymentDTO> totalPaymentDTOS = new ArrayList<>();

            for (TotalPayment totalPayment : totalPaymentEntities) {
                TotalPaymentDTO totalPaymentDTO = TotalPaymentDTO.builder()
                        .totalPaymentId(totalPayment.getTotalPaymentId())
                        .purchaser(totalPayment.getPurchaser())
                        .totalPrice(totalPayment.getTotalPrice())
                        .dateTime(totalPayment.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                        .paymentDTOS(toPaymentDTOS(totalPayment.getPayments()))
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
            Payment payment = (Payment) resultMap.get("data");

            PaymentDTO paymentDTO = PaymentDTO.builder()
                    .paymentId(payment.getPaymentId())
                    .storeId(payment.getStoreId())
                    .productId(payment.getProductId())
                    .optionId(payment.getOptionId())
                    .price(payment.getPrice())
                    .quantity(payment.getQuantity())
                    .dateTime(payment.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                    .build();

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(paymentDTO)
                    .build();
        } else if (resultMap.containsKey("dataList")) {
            List<Payment> paymentEntities = (List<Payment>) resultMap.get("dataList");
            List<PaymentDTO> paymentDTOS = new ArrayList<>();

            for (Payment payment : paymentEntities) {
                PaymentDTO paymentDTO = PaymentDTO.builder()
                        .paymentId(payment.getPaymentId())
                        .storeId(payment.getStoreId())
                        .productId(payment.getProductId())
                        .optionId(payment.getOptionId())
                        .price(payment.getPrice())
                        .quantity(payment.getQuantity())
                        .dateTime(payment.getDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
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