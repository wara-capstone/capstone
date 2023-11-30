package com.payment.DTO;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SimpleResponseDTO {
    String result;
    String message;
}