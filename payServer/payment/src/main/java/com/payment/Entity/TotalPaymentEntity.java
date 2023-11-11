package com.payment.Entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class TotalPaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "totalPaymentId")
    Long totalPaymentId;
    String purchaser;
    Long totalPrice;
    LocalDateTime dateTime;

    @OneToMany(mappedBy = "totalPaymentEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    List<PaymentEntity> payments;

    @Override
    public String toString() {
        return "TotalPaymentEntity{" +
                "totalPaymentId=" + totalPaymentId +
                ", purchaser='" + purchaser + '\'' +
                ", totalPrice=" + totalPrice +
                ", dateTime=" + dateTime +
                ", payments=" + (payments != null ? payments.size() : "null") +
                '}';
    }
}
