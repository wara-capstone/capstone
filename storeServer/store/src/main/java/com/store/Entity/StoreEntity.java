package com.store.Entity;

import lombok.*;
import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Builder
public class StoreEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long storeId;
    String storeName;
    String storeAddress;
    String storePhone;
    String storeSeller;
    Double storeLocationX;
    Double storeLocationY;
    String storeImage;
    String storeContents;

    @ElementCollection
    @CollectionTable(name = "store_product", joinColumns = @JoinColumn(name = "store_id"))
    @Column(name = "product_id")
    List<Long> productIds;
}
