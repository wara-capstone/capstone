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
public class PaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long paymentId;
    Long storeId;
    Long productId;
    Long optionId;
    Long price;
    Long quantity;
    LocalDateTime dateTime;

    @ManyToOne
    @JoinColumn(name = "total_payment_id")
    TotalPaymentEntity totalPaymentEntity;

    @Override
    public String toString() {
        return "PaymentEntity{" +
                "paymentId=" + paymentId +
                ", storeId=" + storeId +
                ", productId=" + productId +
                ", optionId=" + optionId +
                ", price=" + price +
                ", quantity=" + quantity +
                ", dateTime=" + dateTime +
                ", totalPaymentEntity=" + (totalPaymentEntity != null ? totalPaymentEntity.getTotalPaymentId() : "null") +
                '}';
    }
}
