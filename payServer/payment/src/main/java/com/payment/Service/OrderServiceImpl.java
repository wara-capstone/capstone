package com.payment.Service;

import com.payment.DAO.OrderDAO;
import com.payment.DTO.*;
import com.payment.Entity.Order;
import com.payment.Entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService{
    private final OrderDAO orderDAO;

    @Autowired
    public OrderServiceImpl(OrderDAO orderDAO) {
        this.orderDAO = orderDAO;
    }

    @Override
    public OrderResponseDTO createOrder(OrderDTO orderDTO, List<OrderItemDTO> orderItemDTOList) {
        Order order = toOrderEntity(orderDTO, orderItemDTOList);
        Map<String, Object> resultMap = orderDAO.createPayment(order);
        return toOrderResponseDTO(resultMap, order.getId());
    }

    @Override
    public Order findByOrderId(Long orderId) {
        return orderDAO.readOrder(orderId);
    }

    @Override
    public void deleteOrder(Order order) {
        orderDAO.deleteOrder(order);
    }

    public Order toOrderEntity(OrderDTO orderDTO, List<OrderItemDTO> orderItemDTOList){
        return Order.builder()
                .id(orderDTO.getId())
                .purchaser(orderDTO.getPurchaser())
                .totalPrice(orderDTO.getTotalPrice())
                .orderItemList(toOrderItemEntity(orderItemDTOList))
                .build();
    }

    public List<OrderItem> toOrderItemEntity(List<OrderItemDTO> orderItemDTOList){
        List<OrderItem> orderItemList = new ArrayList<OrderItem>();

        for(OrderItemDTO orderItemDTO : orderItemDTOList){
            OrderItem orderItem = OrderItem.builder()
                    .id(orderItemDTO.getId())
                    .storeId(orderItemDTO.getStoreId())
                    .productId(orderItemDTO.getProductId())
                    .optionId(orderItemDTO.getOptionId())
                    .price(orderItemDTO.getPrice())
                    .quantity(orderItemDTO.getQuantity())
                    .build();
            orderItemList.add(orderItem);
        }

        return orderItemList;
    }

    public OrderResponseDTO toOrderResponseDTO(Map<String, Object> resultMap, Long orderId){
        return OrderResponseDTO.builder()
                .result(resultMap.get("result").toString())
                .orderId(orderId)
                .build();
    }
}
