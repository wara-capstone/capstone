package dev.cart.cart.dto;


import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CartDTO {
    private Long id;
    private String email;
    @Builder.Default
    private List<ProductInfoDTO> productInfo = new ArrayList<>();


}
