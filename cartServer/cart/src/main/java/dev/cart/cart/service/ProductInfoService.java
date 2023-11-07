package dev.cart.cart.service;

import dev.cart.cart.dto.ProductInfoDTO;
import org.springframework.http.ResponseEntity;

public interface ProductInfoService {

    public ResponseEntity<ProductInfoDTO> createProductInfo(ProductInfoDTO productInfoDTO);
    public ResponseEntity<ProductInfoDTO> updateProductInfo(ProductInfoDTO productInfoDTO);


}
