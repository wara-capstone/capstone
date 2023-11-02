package com.store.DTO;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StoreDTO {
    String storeName;
    String storeSeller;
    String storeAddress;
    double storeLocationX;
    double storeLocationY;
    String storeImage;
    List<Long> productId;
    String storeContents;
}
