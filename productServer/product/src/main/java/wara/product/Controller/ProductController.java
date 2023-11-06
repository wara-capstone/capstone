package wara.product.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import wara.product.DTO.DummyDTO;
import wara.product.DTO.ProductDTO;
import wara.product.DTO.ResponseDTO;
import wara.product.Service.TransrationService;
import wara.product.Service.ProductService;

import javax.transaction.Transactional;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/product")
public class ProductController {

    private final ProductService productService;
    private final TransrationService transrationService;

    public ProductController(@Autowired ProductService productService,
                             @Autowired TransrationService transrationService) {
        this.productService = productService;
        this.transrationService = transrationService;
    }



    /**
     * 단일 상품 정보 조회
     * */
    @GetMapping("/single/read")
    public ResponseDTO<ProductDTO> singleProductInfo(@RequestParam Long productId) {
        return productService.singleProductInfo(productId);
    }


    /**
     * 한 상점의 모든 상품 정보 조회
     * */
    @GetMapping("/multi/read")
    public ResponseDTO<List<ProductDTO>> multiProductInfo(Long storeId){
        return productService.multiProductInfo(storeId);
    }


    /**
     * 상품정보 수정
     * */
    //TODO: 수정의 경우 URL, 사진을 어떻게 할것인가
//    @PostMapping("/modify")
//    public HttpStatus modifyProductInfo(@RequestBody ProductDTO dto){
//        return productService.modifyProductInfo(dto);


    @PostMapping("/modify")
    public HttpStatus modifyProductInfo(@RequestPart DummyDTO dto, @RequestPart MultipartFile image){
        if(image.isEmpty()) return productService.modifyProductInfo(new ProductDTO());
        else return HttpStatus.OK; //TODO: 이미지서버 업데이트기능이 생겨야함



    }


    /**
     * 상품정보 등록
     * @param dto image data 미포함
     * @param image image data 포함
     * @return
     */
    @PutMapping("/registry")@Transactional
    public String initProductInfo(@RequestPart DummyDTO dto, @RequestPart MultipartFile image) throws URISyntaxException, IOException {

        //이미지서버에 이미지 등록 후 URL반환
        String url = transrationService.uploadImage(image);

        List<Long> productId = new ArrayList<>();
        productId.add(productService.initProductInfo(new ProductDTO(dto,url)));

        if(transrationService.validCheckFromStore(dto.getStoreId(), productId).equals("fail"))
        {
            productService.removeSingleProduct(productId.get(0));
            return HttpStatus.NOT_ACCEPTABLE.toString();
        }

        return HttpStatus.CREATED.toString();
    }


    @DeleteMapping("/single/remove")
    public HttpStatus removeSingleProduct(Long productId){
        return productService.removeSingleProduct(productId);
    }

    @DeleteMapping("/multi/remove")
    public HttpStatus removeMultiProduct(Long storeId){
        return productService.removeMultiProduct(storeId);
    }

}
