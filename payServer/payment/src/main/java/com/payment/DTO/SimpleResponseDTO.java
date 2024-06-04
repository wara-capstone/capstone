package com.payment.DTO;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SimpleResponseDTO {
    private String result;
    private String message;
}