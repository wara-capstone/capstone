package com.payment.Controller;

import com.payment.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(@Autowired PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
