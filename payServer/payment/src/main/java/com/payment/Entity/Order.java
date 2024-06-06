package com.payment.Entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Table(name = "orders")
@NoArgsConstructor
@ToString
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String purchaser;
    private Long totalPrice;
    private LocalDateTime dateTime;
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn
    private List<OrderItem> orderItemList;

    @Builder
    public Order(Long id, String purchaser, Long totalPrice, List<OrderItem> orderItemList) {
        this.id = id;
        this.purchaser = purchaser;
        this.totalPrice = totalPrice;
        this.orderItemList = orderItemList;
    }

    public void updateDateTime(LocalDateTime dateTime){
        this.dateTime = dateTime;
    }
}
