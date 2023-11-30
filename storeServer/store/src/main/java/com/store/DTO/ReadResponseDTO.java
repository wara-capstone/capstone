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
    Long storeId;
    String storeName;
    String storeSeller;
    String storeAddress;
    String storePhone;
    double storeLocationX;
    double storeLocationY;
    String storeImage;
    String storeContents;
    List<Long> productId;
}
