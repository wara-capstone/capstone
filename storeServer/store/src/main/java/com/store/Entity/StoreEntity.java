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
    private Long storeId;
    private String storeName;
    private String storeAddress;
    private String storePhone;
    private String storeSeller;
    private Double storeLocationX;
    private Double storeLocationY;
    private String storeImage;
    private String storeContents;

    @ElementCollection
    @CollectionTable(name = "store_product", joinColumns = @JoinColumn(name = "store_id"))
    @Column(name = "product_id")
    private List<Long> productIds;
}
