package com.payment.Controller;

import com.payment.DTO.OrderDTO;
import com.payment.DTO.OrderItemDTO;
import com.payment.DTO.OrderResponseDTO;
import com.payment.Service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payment/order")
public class OrderController {
    private final OrderService orderService;
    private final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public OrderResponseDTO createOrder(@RequestPart("order") OrderDTO orderDTO,
                                        @RequestPart("orderItem") List<OrderItemDTO> orderItemList){
        logger.info("OrderController - createOrder: Creating order...");
        OrderResponseDTO response = orderService.createOrder(orderDTO, orderItemList);
        if(response.getResult().equals("success")){
            logger.info("OrderController - createOrder: Order creation successful");
        } else {
            logger.error("OrderController - createOrder: Failed to create order");
        }
        return response;
    }
}
