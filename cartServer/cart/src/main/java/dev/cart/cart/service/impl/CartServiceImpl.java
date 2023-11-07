package dev.cart.cart.service.impl;

import dev.cart.cart.dao.CartDAO;
import dev.cart.cart.dto.CartDTO;
import dev.cart.cart.dto.ProductInfoDTO;
import dev.cart.cart.entity.CartEntity;
import dev.cart.cart.entity.ProductInfoEntity;
import dev.cart.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    private  final CartDAO cartDAO;

    public CartServiceImpl(
            @Autowired CartDAO cartDAO
    ){
        this.cartDAO = cartDAO;
    }

    @Override
    public ResponseEntity<CartDTO> createCart(CartDTO cartDTO) {
        if(this.cartDAO.existsByEmail(cartDTO.getEmail())){
            return ResponseEntity.status(400).body(null);
        }

        CartEntity cart = CartEntity.builder()
                .email(cartDTO.getEmail())
                .build();
        cart = this.cartDAO.createCart(cart);
        cartDTO = CartDTO.builder()
                .id(cart.getId())
                .email(cart.getEmail())
                .build();

        return ResponseEntity.status(201).body(cartDTO);
    }

    @Override
    public ResponseEntity<CartDTO> readCart(String email) {
        Optional<CartEntity> cartOptional = this.cartDAO.readCart(email);
        if(!cartOptional.isPresent()){
            return ResponseEntity.status(400).body(null);
        }
        CartEntity cart = cartOptional.get();
        List<ProductInfoDTO> info = new ArrayList<>();
        for(ProductInfoEntity productInfo : cart.getProductInfoEntities()){
            info.add(
                    ProductInfoDTO.builder()
                            .storeId(productInfo.getStoreId())
                            .quantity(productInfo.getQuantity())
                            .productInfoId(productInfo.getId())
                            .productId(productInfo.getProductId())
                            .build()
            );
        }

        CartDTO cartDTO = CartDTO.builder()
                .id(cart.getId())
                .email(cart.getEmail())
                .productInfo(info)
                .build();

        return ResponseEntity.status(200).body(cartDTO);
    }

    @Override
    public ResponseEntity<Boolean> deleteCart(String email) {
        return this.deleteCart(email);
    }


}
