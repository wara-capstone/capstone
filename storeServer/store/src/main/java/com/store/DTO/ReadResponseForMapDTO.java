package com.store.DTO;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ReadResponseForMapDTO {
    Long storeId;
    String storeName;
    String storeAddress;
    String storePhone;
    String storeImage;
    Double storeLocationX;
    Double storeLocationY;
}
