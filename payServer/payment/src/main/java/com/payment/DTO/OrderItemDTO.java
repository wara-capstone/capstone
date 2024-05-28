package com.payment.DTO;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderItemDTO {
    private Long id;
    private Long storeId;
    private Long productId;
    private Long optionId;
    private Long price;
    private Long quantity;
}
