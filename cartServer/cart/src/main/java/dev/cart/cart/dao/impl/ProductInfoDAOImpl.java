package dev.cart.cart.dao.impl;

import dev.cart.cart.dao.ProductInfoDAO;
import dev.cart.cart.entity.CartEntity;
import dev.cart.cart.entity.ProductInfoEntity;
import dev.cart.cart.repository.ProductInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProductInfoDAOImpl implements ProductInfoDAO {

    private final ProductInfoRepository productInfoRepository;

    public ProductInfoDAOImpl(
            @Autowired ProductInfoRepository productInfoRepository
    ) {
        this.productInfoRepository = productInfoRepository;
    }
    @Override
    public ProductInfoEntity createProductInfo(ProductInfoEntity productInfo) {
        return this.productInfoRepository.save(productInfo);
    }

    @Override
    public Optional<ProductInfoEntity> readProductInfo(CartEntity cart, Long productId) {
        return this.productInfoRepository.findByCartAndProductId(cart, productId);
    }

    @Override
    public Boolean deleteProductInfo(Long id) {
        if(!this.productInfoRepository.existsById(id)){
            return false;
        }
        this.productInfoRepository.deleteById(id);
        return true;
    }
}
