package dev.cart.cart.controller;


import dev.cart.cart.dto.CartDTO;
import dev.cart.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {


    private final CartService cartService;

    public CartController(
            @Autowired CartService cartService
    ){
        this.cartService = cartService;
    }

    @PostMapping()
    public ResponseEntity<CartDTO> createCart(
        @RequestParam("email") String email
    ){
        return this.cartService.createCart(CartDTO.builder().email(email).build());
    }

    @GetMapping()
    public ResponseEntity<CartDTO> readCart(
            @RequestParam("email") String email
    ){
        return this.cartService.readCart(email);
    }

    @DeleteMapping()
    public ResponseEntity<Boolean> deleteCart(
            @RequestParam("email") String email
    ){
        return this.cartService.deleteCart(email);
    }


}
