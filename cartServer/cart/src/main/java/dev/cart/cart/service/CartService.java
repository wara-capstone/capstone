package dev.cart.cart.service;


import dev.cart.cart.dto.CartDTO;
import org.springframework.http.ResponseEntity;

public interface CartService {
    public ResponseEntity<CartDTO> createCart(CartDTO cartDTO);
    public ResponseEntity<CartDTO> readCart(String email);
    public ResponseEntity<Boolean> deleteCart(String email);

}

