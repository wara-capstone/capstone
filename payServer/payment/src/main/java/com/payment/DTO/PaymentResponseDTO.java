package com.payment.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PaymentResponseDTO {
    Long paymentId;
    Long storeId;
    Long productId;
    String purchaser;
    Long price;
    LocalDateTime dateTime;
}
