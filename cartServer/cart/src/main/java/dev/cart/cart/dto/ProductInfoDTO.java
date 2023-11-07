package dev.cart.cart.dto;


import lombok.*;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ProductInfoDTO {
    private Long productInfoId;
    private Long productId;
    private Long storeId;
    private Long quantity;

}
