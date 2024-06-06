package com.payment.Entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "order_item")
@NoArgsConstructor
@ToString
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long storeId;
    private Long productId;
    private Long optionId;
    private Long price;
    private Long quantity;

    @Builder
    public OrderItem(Long id, Long storeId, Long productId, Long optionId, Long price, Long quantity) {
        this.id = id;
        this.storeId = storeId;
        this.productId = productId;
        this.optionId = optionId;
        this.price = price;
        this.quantity = quantity;
    }
}
