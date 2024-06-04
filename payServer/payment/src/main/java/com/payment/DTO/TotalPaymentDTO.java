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
    private Long totalPaymentId;
    private String purchaser;
    private Long totalPrice;
    private String dateTime;
    private List<PaymentDTO> paymentDTOS;
}
