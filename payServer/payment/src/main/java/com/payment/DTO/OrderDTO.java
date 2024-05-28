package com.payment.DTO;

import com.payment.Entity.OrderItem;
import lombok.*;

import javax.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderDTO {
    private Long id;
    private String purchaser;
    private Long totalPrice;
    private LocalDateTime dateTime;
    private List<OrderItemDTO> orderItemDTOList;
}
