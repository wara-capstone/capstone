package com.payment.Controller;

import com.payment.DTO.*;
import com.payment.Service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    private final PaymentService paymentService;
    private final static Logger logger = LoggerFactory.getLogger(PaymentController.class);

    public PaymentController(@Autowired PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<SimpleResponseDTO> createPayment(@RequestBody PaymentRequestDTO paymentRequestDTO){
        logger.info("[Request] : CreatePayment");
        logger.info("[Data]: " + paymentRequestDTO.toString());
        SimpleResponseDTO response = paymentService.createImportPayment(paymentRequestDTO);
        logger.info("[Response] : " + response.toString());

        if(response.getResult().equals("success")){
            return ResponseEntity.status(201).body(response);
        }

        return ResponseEntity.status(400).body(null);
    }

    @GetMapping("/read/store/{storeId}")
    public ResponseEntity<ResponseDTO> readPaymentByStoreId(@PathVariable Long storeId){
        logger.info("[Request] : ReadPaymentByStoreId");
        logger.info("[Data]: " + storeId);
        ResponseDTO response = paymentService.readPaymentByStoreId(storeId);
        logger.info("[Response] : " + response.toString());

        if(response.getResult().equals("success")){
            return ResponseEntity.status(200).body(response);
        }

        return ResponseEntity.status(400).body(null);
    }

    @GetMapping("/read/user/{purchaser}")
    public ResponseEntity<ResponseDTO> readPaymentByPurchaser(@PathVariable String purchaser){
        logger.info("[Request] : ReadPaymentByPurchaser");
        logger.info("[Data]: " + purchaser);
        ResponseDTO response = paymentService.readPaymentByPurchaser(purchaser);
        logger.info("[Response] : " + response.toString());

        if(response.getResult().equals("success")){
            return ResponseEntity.status(200).body(response);
        }

        return ResponseEntity.status(400).body(null);
    }

    @DeleteMapping("/delete/{paymentId}")
    public ResponseEntity<SimpleResponseDTO> deletePayment(@PathVariable Long paymentId){
        logger.info("[Request] : DeletePayment");
        logger.info("[Data]: " + paymentId);
        SimpleResponseDTO response = paymentService.deletePayment(paymentId);
        logger.info("[Response] : " + response.toString());

        if(response.getResult().equals("success")){
            return ResponseEntity.status(200).body(response);
        }

        return ResponseEntity.status(400).body(null);
    }
}
