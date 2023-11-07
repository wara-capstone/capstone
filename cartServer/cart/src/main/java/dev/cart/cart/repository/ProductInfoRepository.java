package dev.cart.cart.repository;

import dev.cart.cart.entity.CartEntity;
import dev.cart.cart.entity.ProductInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductInfoRepository extends JpaRepository<ProductInfoEntity, Long> {
    public Optional<ProductInfoEntity> findByCartAndProductId(CartEntity cart, Long productId);

}
