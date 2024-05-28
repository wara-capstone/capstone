package com.payment.Controller;

import com.payment.DTO.OrderDTO;
import com.payment.DTO.OrderItemDTO;
import com.payment.DTO.OrderResponseDTO;
import com.payment.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public OrderResponseDTO createOrder(@RequestPart("order") OrderDTO orderDTO,
                                        @RequestPart("orderItem") List<OrderItemDTO> orderItemList){
        return orderService.createOrder(orderDTO, orderItemList);
    }
}
