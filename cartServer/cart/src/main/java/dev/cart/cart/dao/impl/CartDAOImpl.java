package dev.cart.cart.dao.impl;

import dev.cart.cart.entity.CartEntity;
import dev.cart.cart.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public class CartDAOImpl implements dev.cart.cart.dao.CartDAO {

    private final CartRepository cartRepository;

    public CartDAOImpl(
            @Autowired CartRepository cartRepository
    ){
        this.cartRepository = cartRepository;
    }

    @Override
    public CartEntity createCart(CartEntity cart) {
        return this.cartRepository.save(cart);
    }

    @Override
    public Optional<CartEntity> readCart(String email) {
        return this.cartRepository.findByEmail(email);
    }

    @Override
    public Boolean existsByEmail(String email) {
        return this.cartRepository.existsByEmail(email);
    }

    @Override
    public Boolean deleteCart(String email) {
        if(!this.cartRepository.existsByEmail(email)){
            return false;
        }
        this.cartRepository.deleteByEmail(email);
        return true;
    }
}
