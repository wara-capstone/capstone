package wara.product.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import wara.product.DTO.ProductDTO;
import wara.product.DTO.ResponseDTO;
import wara.product.Service.PostService;
import wara.product.Service.ProductService;

import java.util.List;


@RestController
public class ProductController {

    private final ProductService productService;
    private final PostService postService;

    public ProductController(@Autowired ProductService productService,
                             @Autowired PostService postService) {
        this.productService = productService;
        this.postService = postService;
    }

    /**
     * 단일 상품 정보 조회
     * */
    @GetMapping("/single-read")
    public ResponseDTO<ProductDTO> singleProductInfo(@RequestParam Long ProductId) {
        return productService.singleProductInfo(ProductId);
    }


    /**
     * 여러개의 상품 정보 조회
     * */
    @GetMapping("/multi-read")
    public ResponseDTO<List<ProductDTO>> multiProductInfo(Long storeId){

        return productService.multiProductInfo(storeId);
    }


    /**
     * 상품정보 수정
     * */
    // TODO: 상품정보 수정의 다양한 경우를 고려 해야함
    @PostMapping("/modify")
    public HttpStatus modifyProductInfo(@RequestBody ProductDTO dto){
        return productService.modifyProductInfo(dto);

    }

    /**
     * 상품정보 등록
     * */
    @PutMapping("/registry")
    public HttpStatus initProductInfo(@RequestBody ProductDTO dto){
        return productService.initProductInfo(dto);
    }


    @DeleteMapping("/single-remove")
    public HttpStatus removeSingleProduct(Long productId){
        return productService.removeSingleProduct(productId);
    }

    @DeleteMapping("/multi-remove")
    public HttpStatus removeMultiProduct(Long productId){
        return productService.removeMultiProduct(productId);
    }




}
