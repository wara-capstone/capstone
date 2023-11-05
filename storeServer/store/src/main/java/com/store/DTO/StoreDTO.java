package com.store.DTO;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StoreDTO {
    Long storeId;
    String storeName;
    String storeSeller;
    String storeAddress;
    String storePhone;
    double storeLocationX;
    double storeLocationY;
    String storeImage;
    List<Long> productId;
    String storeContents;
}
