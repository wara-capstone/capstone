package com.payment.DTO;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TotalPaymentDTO {
    Long totalPaymentId;
    String purchaser;
    Long totalPrice;
    String dateTime;
    List<PaymentDTO> paymentDTOS;
}
