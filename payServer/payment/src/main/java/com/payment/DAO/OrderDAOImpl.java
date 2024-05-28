package com.payment.DAO;

import com.payment.Entity.Order;
import com.payment.Entity.Payment;
import com.payment.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Repository
public class OrderDAOImpl implements OrderDAO{
    private final OrderRepository orderRepository;

    @Autowired
    public OrderDAOImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Map<String, Object> createPayment(Order order) {
        Map<String, Object> result = new HashMap<>();

        order.updateDateTime(LocalDateTime.now());
        orderRepository.save(order);

        result.put("result", "success");

        return result;
    }

    @Override
    public Order readOrder(Long orderId) {
        return orderRepository.getReferenceById(orderId);
    }

    public void deleteOrder(Order order){
        orderRepository.delete(order);
    }
}