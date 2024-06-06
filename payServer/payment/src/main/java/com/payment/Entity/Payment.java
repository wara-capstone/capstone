package com.payment.Entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;
    private Long storeId;
    private Long productId;
    private Long optionId;
    private Long price;
    private Long quantity;
    private String purchaser;
    private LocalDateTime dateTime;

    public void updateDateTime(LocalDateTime dateTime){
        this.dateTime = dateTime;
    }

    @Override
    public String toString() {
        return "PaymentEntity{" +
                "paymentId=" + paymentId +
                ", storeId=" + storeId +
                ", productId=" + productId +
                ", optionId=" + optionId +
                ", price=" + price +
                ", quantity=" + quantity +
                ", dateTime=" + dateTime + "}";
    }
}
