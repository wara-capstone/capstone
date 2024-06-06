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
public class TotalPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long totalPaymentId;
    private String purchaser;
    private Long totalPrice;
    private LocalDateTime dateTime;
    private String paymentUid; // 결제 고유 번호

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn
    private List<Payment> payments;

    public void updateDateTime(LocalDateTime dateTime){
        this.dateTime = dateTime;
    }

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
