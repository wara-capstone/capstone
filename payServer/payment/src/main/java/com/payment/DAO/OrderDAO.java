package com.payment.DAO;

import com.payment.Entity.Order;

import java.util.Map;

public interface OrderDAO {
    public Map<String, Object> createPayment(Order order);
    public Order readOrder(Long orderId);
    public void deleteOrder(Order order);
}
