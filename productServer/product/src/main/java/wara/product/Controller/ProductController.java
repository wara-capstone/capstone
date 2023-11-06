package wara.product.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import wara.product.DTO.DummyDTO;
import wara.product.DTO.ProductDTO;
import wara.product.DTO.ResponseDTO;
import wara.product.Service.PostService;
import wara.product.Service.ProductService;

import javax.transaction.Transactional;
import javax.ws.rs.core.NewCookie;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
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
     * 한 상점의 모든 상품 정보 조회
     * */
    @GetMapping("/multi-read")
    public ResponseDTO<List<ProductDTO>> multiProductInfo(Long storeId){
        return productService.multiProductInfo(storeId);
    }


    /**
     * 상품정보 수정
     * */
    @PostMapping("/modify")
    public HttpStatus modifyProductInfo(@RequestBody ProductDTO dto){
        return productService.modifyProductInfo(dto);

    }

    /**
     * 상품정보 등록
     * */
    @PutMapping("/registry")@Transactional
    public String initProductInfo(@RequestPart DummyDTO dto, @RequestPart MultipartFile image) throws URISyntaxException, IOException {

        //이미지서버에 이미지 등록 후 URL반환
        String url = postService.uploadImage(image);

        List<Long> productId = new ArrayList<>();
        productId.add(productService.initProductInfo(new ProductDTO(dto,url)));

        if(postService.toStore(dto.getStoreId(), productId).equals("success"))
        {
            productService.removeSingleProduct(productId.get(0));
            return "store NO VALID";
        }

        return "GOOD";
    }









    @DeleteMapping("/single-remove")
    public HttpStatus removeSingleProduct(Long productId){
        return productService.removeSingleProduct(productId);
    }

    @DeleteMapping("/multi-remove")
    public HttpStatus removeMultiProduct(Long productId){
        return productService.removeMultiProduct(productId);
    }




    @PostMapping("/reg")
    public void regImg(@RequestPart MultipartFile image) throws IOException, URISyntaxException {
//        String action = "/image/upload";
        postService.uploadImage(image);

    }

//
//    @GetMapping("/dl")
//    public ResponseEntity<ByteArrayResource> download() throws URISyntaxException, IOException {
//
//        ResponseEntity<MultipartFile> response = postService.downloadImage();
//
//        MultipartFile image = response.getBody();
//        ByteArrayResource imageResource = new ByteArrayResource(image.getBytes()) {
//            @Override
//            public String getFilename() {
//                return image.getOriginalFilename();
//            }
//        };
//
//
//        MediaType mediaType = MediaType.IMAGE_JPEG; // 이미지 유형에 따라 조정
//
//        return ResponseEntity.ok()
//                .contentLength(image.getBytes().length)
//                .contentType(mediaType)
//                .body(imageResource);
//
//    }



    @GetMapping("/image")
    public ResponseEntity<ByteArrayResource> getImage(@RequestParam MultipartFile image) throws IOException {
        ByteArrayResource imageResource = new ByteArrayResource(image.getBytes()) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        };


        // 이미지의 MIME 유형을 설정
        MediaType mediaType = MediaType.IMAGE_JPEG; // 이미지 유형에 따라 조정

        return ResponseEntity.ok()
                .contentLength(image.getBytes().length)
                .contentType(mediaType)
                .body(imageResource);
    }



}
