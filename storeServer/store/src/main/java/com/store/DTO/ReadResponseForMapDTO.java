package com.store.DTO;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ReadResponseForMapDTO {
    private Long storeId;
    private String storeName;
    private String storeAddress;
    private String storePhone;
    private String storeImage;
    private Double storeLocationX;
    private Double storeLocationY;
}
