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
        logger.info("Controller Layer - createPayment: Creating payment...");
        SimpleResponseDTO response = paymentService.createImportPayment(paymentRequestDTO);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - createPayment: Payment creation successful");
            return ResponseEntity.status(201).body(response);
        }
        logger.error("Controller Layer - createPayment: Failed to create payment");
        return ResponseEntity.status(500).body(null);
    }

    @GetMapping("/read/store/{storeId}")
    public ResponseEntity<ResponseDTO> readPaymentByStoreId(@PathVariable Long storeId){
        logger.info("Controller Layer - readPaymentByStoreId: Reading payment by store ID: {}", storeId);
        ResponseDTO response = paymentService.readPaymentByStoreId(storeId);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - readPaymentByStoreId: Payment found for store ID: {}", storeId);
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - readPaymentByStoreId: Failed to read payment for store ID: {}", storeId);
        return ResponseEntity.status(500).body(null);
    }

    @GetMapping("/read/user/{purchaser}")
    public ResponseEntity<ResponseDTO> readPaymentByPurchaser(@PathVariable String purchaser){
        logger.info("Controller Layer - readPaymentByPurchaser: Reading payment by purchaser: {}", purchaser);
        ResponseDTO response = paymentService.readPaymentByPurchaser(purchaser);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - readPaymentByPurchaser: Payment found for purchaser: {}", purchaser);
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - readPaymentByPurchaser: Failed to read payment for purchaser: {}", purchaser);
        return ResponseEntity.status(500).body(null);
    }

    @DeleteMapping("/delete/{paymentId}")
    public ResponseEntity<SimpleResponseDTO> deletePayment(@PathVariable Long paymentId){
        logger.info("Controller Layer - deletePayment: Deleting payment by ID: {}", paymentId);
        SimpleResponseDTO response = paymentService.deletePayment(paymentId);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - deletePayment: Payment deleted successfully with ID: {}", paymentId);
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - deletePayment: Failed to delete payment with ID: {}", paymentId);
        return ResponseEntity.status(500).body(null);
    }

}
