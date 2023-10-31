package wara.product.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import wara.product.DTO.ProductDTO;
import wara.product.Service.ProductService;


@RestController
public class ProductController {

    private static ProductService service;

    public ProductController(@Autowired ProductService service) {
        this.service = service;
    }

    /**
     * 단일 상품 정보 조회
     * */
    @GetMapping()
    public void singleProductInfo(@RequestParam ProductDTO dto) {
        service.singleProductInfo(dto);
    }


    /**
     * 여러개의 상품 정보 조회
     * */
    @GetMapping()
    public void multiProductInfo(@RequestParam ProductDTO dto){
        service.multiProductInfo(dto);
    }


    /**
     * 상품정보 수정
     * */
    // TODO: 상품정보 수정의 다양한 경우를 고려 해야함
    @PostMapping()
    public void modifyProductInfo(){}

    /**
     * 상품정보 등록
     * */
    @PutMapping()
    public void configProductInfo(){}







}
