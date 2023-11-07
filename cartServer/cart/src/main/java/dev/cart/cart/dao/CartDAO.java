package dev.cart.cart.dao;

import dev.cart.cart.entity.CartEntity;

import java.util.Optional;

public interface CartDAO {

    public CartEntity createCart(CartEntity cart);
    public Optional<CartEntity> readCart(String email);
    public Boolean existsByEmail(String email);
    public Boolean deleteCart(String email);

}
