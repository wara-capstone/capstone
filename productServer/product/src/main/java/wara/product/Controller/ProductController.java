package wara.product.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import wara.product.DTO.ProductDTO;
import wara.product.DTO.ResponseDTO;
import wara.product.Service.ProductService;

import java.util.List;


@RestController
public class ProductController {

    private final ProductService service;

    public ProductController(@Autowired ProductService service) {
        this.service = service;
    }

    /**
     * 단일 상품 정보 조회
     * */
    @GetMapping("/single-read")
    public ResponseDTO<ProductDTO> singleProductInfo(@RequestParam Long ProductId) {
        return service.singleProductInfo(ProductId);
    }


    /**
     * 여러개의 상품 정보 조회
     * */
    @GetMapping("/multi-read")
    public ResponseDTO<List<ProductDTO>> multiProductInfo(Long storeId){

        return service.multiProductInfo(storeId);
    }


    /**
     * 상품정보 수정
     * */
    // TODO: 상품정보 수정의 다양한 경우를 고려 해야함
    @PostMapping("/modify")
    public HttpStatus modifyProductInfo(@RequestBody ProductDTO dto){
        return service.modifyProductInfo(dto);

    }

    /**
     * 상품정보 등록
     * */
    @PutMapping("/registry")
    public HttpStatus initProductInfo(@RequestBody ProductDTO dto){
        return service.initProductInfo(dto);
    }


    @DeleteMapping("/single-remove")
    public HttpStatus removeSingleProduct(Long productId){
        return service.removeSingleProduct(productId);
    }

    @DeleteMapping("/multi-remove")
    public HttpStatus removeMultiProduct(Long productId){
        return service.removeMultiProduct(productId);
    }


}
