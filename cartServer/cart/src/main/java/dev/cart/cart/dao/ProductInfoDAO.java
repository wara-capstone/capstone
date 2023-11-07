package dev.cart.cart.dao;

import dev.cart.cart.entity.CartEntity;
import dev.cart.cart.entity.ProductInfoEntity;

import java.util.List;
import java.util.Optional;

public interface ProductInfoDAO {


    public ProductInfoEntity createProductInfo(ProductInfoEntity productInfo);
    public Optional<ProductInfoEntity> readProductInfo(CartEntity cart, Long productId);
    public Boolean deleteProductInfo(Long id);

}
