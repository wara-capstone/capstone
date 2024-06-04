package com.payment.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PaymentDTO {
    private Long paymentId;
    private Long storeId;
    private Long productId;
    private Long optionId;
    private Long price;
    private Long quantity;
    private String dateTime;
}