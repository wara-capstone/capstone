package com.store.DTO;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ResponseDTO {
    Long storeId;
    String storeName;
    String storeSeller;
    String storeAddress;
    double storeLocationX;
    double storeLocationY;
    String storeImage;
    String storeContents;
    String result;
    List<Long> productId;
}
