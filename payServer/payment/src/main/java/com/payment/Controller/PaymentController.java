package com.payment.Controller;

import com.payment.DTO.PaymentDTO;
import com.payment.DTO.TotalPaymentDTO;
import com.payment.DTO.ResponseDTO;
import com.payment.DTO.SimpleResponseDTO;
import com.payment.Service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    private final PaymentService paymentService;
    private final static Logger logger = LoggerFactory.getLogger(PaymentController.class);

    public PaymentController(@Autowired PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<SimpleResponseDTO> createPayment(@RequestPart("totalPayment") TotalPaymentDTO totalPaymentDTO,
                                                           @RequestPart("payment") List<PaymentDTO> paymentDTOS){
        logger.info("[Request] : CreatePayment");
        logger.info("[Data]: " + totalPaymentDTO.toString());
        SimpleResponseDTO response = paymentService.createPayment(totalPaymentDTO, paymentDTOS);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/read/store/{storeId}")
    public ResponseEntity<ResponseDTO> readPaymentByStoreId(@PathVariable Long storeId){
        logger.info("[Request] : ReadPaymentByStoreId");
        logger.info("[Data]: " + storeId);
        ResponseDTO response = paymentService.readPaymentByStoreId(storeId);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/read/user/{purchaser}")
    public ResponseEntity<ResponseDTO> readPaymentByPurchaser(@PathVariable String purchaser){
        logger.info("[Request] : ReadPaymentByPurchaser");
        logger.info("[Data]: " + purchaser);
        ResponseDTO response = paymentService.readPaymentByPurchaser(purchaser);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @DeleteMapping("/delete/{paymentId}")
    public ResponseEntity<SimpleResponseDTO> deletePayment(@PathVariable Long paymentId){
        logger.info("[Request] : DeletePayment");
        logger.info("[Data]: " + paymentId);
        SimpleResponseDTO response = paymentService.deletePayment(paymentId);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }
}
