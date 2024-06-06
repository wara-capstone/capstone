package com.store.DTO;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ReadResponseDTO {
    private Long storeId;
    private String storeName;
    private String storeSeller;
    private String storeAddress;
    private String storePhone;
    private double storeLocationX;
    private double storeLocationY;
    private String storeImage;
    private String storeContents;
    private List<Long> productId;
}
