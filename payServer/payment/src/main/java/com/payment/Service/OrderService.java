package com.payment.Service;

import com.payment.DTO.*;
import com.payment.Entity.Order;

import java.util.List;

public interface OrderService {
    public OrderResponseDTO createOrder(OrderDTO orderDTO, List<OrderItemDTO> orderItemDTOList);
    public Order findByOrderId(Long orderId);
    public ResponseDTO readOrderByPurchaser(String purchaser);
    public SimpleResponseDTO deleteOrder(Order order);
}
