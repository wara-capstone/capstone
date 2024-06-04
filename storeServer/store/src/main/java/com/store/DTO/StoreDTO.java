package com.store.DTO;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StoreDTO {
    private Long storeId;
    private String storeName;
    private String storeSeller;
    private String storeAddress;
    private String storePhone;
    private Double storeLocationX;
    private Double storeLocationY;
    private String storeImage;
    private List<Long> productId;
    private String storeContents;
}
