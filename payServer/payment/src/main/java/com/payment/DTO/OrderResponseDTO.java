package com.payment.DTO;


import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderResponseDTO {
    private String result;
    private Long orderId;
}
