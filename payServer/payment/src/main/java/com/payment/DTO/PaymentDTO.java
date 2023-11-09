package com.payment.DTO;

import lombok.*;

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
    String purchaser;
    Long price;
}
