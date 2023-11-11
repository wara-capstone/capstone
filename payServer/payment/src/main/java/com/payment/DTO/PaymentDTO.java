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
    Long paymentId;
    Long storeId;
    Long productId;
    Long optionId;
    Long price;
    Long quantity;
    String dateTime;
}