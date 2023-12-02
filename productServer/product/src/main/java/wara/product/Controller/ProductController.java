package wara.product.Controller;


import org.apache.http.protocol.HTTP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import wara.product.DTO.OptionDTO;
import wara.product.DTO.ProductDTO;
import wara.product.Service.TransrationService;
import wara.product.Service.ProductService;


import javax.transaction.Transactional;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.Objects;


@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final TransrationService transrationService;


    public ProductController(@Autowired ProductService productService,
                             @Autowired TransrationService transrationService) {
        this.productService = productService;
        this.transrationService = transrationService;
    }


    //TODO: 찾는 정보가 없는 경우에 대한 핸들링이 필요함
    //TODO: 핸들링 커스텀 해야함
    /**
     * @param e Controller의 NullPointerException에 대한 핸들링
     * @return
     */
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<String> nullPointerExceptionControl(Exception e)
    {
        return ResponseEntity.status(400).body("");
    }





    /**
     * @param productDTO
     * @param optionDTO
     * @return
     * @throws URISyntaxException
     * @throws IOException
     */
    @PostMapping("/seller") @Transactional
    public ResponseEntity<String> productRegistry(@RequestPart ProductDTO productDTO, @RequestPart OptionDTO optionDTO, @RequestPart List<MultipartFile> images) throws URISyntaxException, IOException {

        productDTO.setProductUrls(transrationService.uploadImage(images));
        //productDTO의 값으로 일단 저장 -> 해당 상품의 ID값 반환
        Long productId = productService.initProduct(productDTO);

        // STORE서버에 해당 상점이 존재하는지 검사
        String storeValid = transrationService.
                initToStore(productDTO.getStoreId(), Collections.singletonList(productId));

        if(!storeValid.equals("success"))
        {//상점이 존재하지 않는 경우
            productService.removeOneProduct(productId);
            return ResponseEntity.status(400).body("");
        }

        if(Objects.nonNull(optionDTO)){
            productService.addOption(productId,optionDTO);
            return ResponseEntity.status(200).body("");
        }
        return ResponseEntity.status(200).body("");
    }



    // 옵션 등록
    @PutMapping("/seller/option/add/product/{productId}") //TODO:바코드 삭제 로직 필요함
    public ResponseEntity<String> optionRegistry(@PathVariable("productId") Long productId,
                                 @RequestBody OptionDTO optionDTO) throws URISyntaxException, IOException {
        productService.readOne(productId); //TODO: 상품이 존쟈하지 않는경우 처리
        productService.addOption(productId,optionDTO);

        return  ResponseEntity.status(200).body("");
    }

    // 상품 수정
    //TODO: 사진 있는경우, 없는경우 분리
    @PutMapping("/seller")
    public ResponseEntity<String> productModify(@RequestPart ProductDTO productDTO)
    {
        productService.modifyProduct(productDTO);
        return  ResponseEntity.status(200).body("");
    }

    //옵션수정
    @PutMapping("/seller/option/{productId}")
    public ResponseEntity<String> optionModify(@PathVariable("productId") Long productId, @RequestPart OptionDTO optionDTO){
        productService.modifyOption(productId, optionDTO);
        return ResponseEntity.status(200).body("");
    }

    @PutMapping("/user/product/{productId}/{optionId}/{stockModify}")
    public ResponseEntity<String> stockModify(@PathVariable("productId") Long productId,
                              @PathVariable("optionId") Long optionId,
                              @PathVariable("stockModify") String stockModify)
    {
        productService.stockModify(productId,optionId,stockModify);
        return  ResponseEntity.status(200).body("");
    }




    // 단일 상품 삭제
    @DeleteMapping("/seller/{storeId}/{productId}") @Transactional
    public ResponseEntity<String> singleRemove(@PathVariable("storeId")Long storeId, @PathVariable("productId") Long productId) throws URISyntaxException, IOException {
        transrationService.removeToStore(storeId, productId);
        productService.removeOneProduct(productId);
        return ResponseEntity.status(200).body("");
    }

    //옵션삭제
    @DeleteMapping("/seller/option/{optionId}")
    public ResponseEntity<String> optionRemove(@PathVariable("optionId") Long optionId)
    {
        productService.removeOption(optionId);
        return ResponseEntity.status(200).body("");
    }


    // store id 기준 모든 상품 삭제
    @DeleteMapping("/seller/store/{storeId}")
    public ResponseEntity<String> multiRemove(@PathVariable("storeId") Long storeId){
        productService.removeManyproduct(storeId);
        return ResponseEntity.status(200).body("");
    }







    /**
     * @param productId 상품 아이디 기준 검색
     * @return 단일 상품의 정보와 해당 상품의 모든 옵션
     */
    @GetMapping("/all/{id}")
    public ResponseEntity<ProductDTO> singleRead(@PathVariable("id") Long productId)
    {
        return ResponseEntity.status(200).body(productService.readOne(productId));
    }


    /**
     * @param productId
     * @param optionId
     * @return 단일 상품, 단일 옵션
     */
    @GetMapping("/all/{productId}/option/{optionId}")
    public ResponseEntity<ProductDTO> readTargetOption(@PathVariable("productId") Long productId, @PathVariable("optionId") Long optionId)
    {
        return ResponseEntity.status(200).body(productService.readTarget(productId,optionId));
    }


    /**
     * @param storeId 상점아이디 기준 모든 상품 검색
     * @return 한 상점의 모든 상품과 옵션
     */
    @GetMapping("/all/store/{storeId}")
    public ResponseEntity<List<ProductDTO>> multiRead(@PathVariable("storeId") Long storeId){
        return ResponseEntity.status(200).body(productService.readMany(storeId));
    }


    /**
     * @param category 카테고리 기준 모든 상품 검색
     * @return 카테고리와 동잍한 모든 상품 + 옵션
     */
    @GetMapping("/all/category/{category}")
    public ResponseEntity<List<ProductDTO>> categoryFilter(@PathVariable("category") String category)
    {
       return ResponseEntity.status(200).body(productService.categoryFilter(category));
    }

    /**
     * @param storeId
     * @param category
     * @return 상점아이디&카테고리에 해당하는 모든 상품 + 옵션
     */
    @GetMapping("/all/store/{storeId}/category")
    public ResponseEntity<List<ProductDTO>> storeCategoryFilter(
            @PathVariable("storeId") Long storeId,
            @RequestParam String category)
    {
        return ResponseEntity.status(200).body(productService.storeCategoryFilter(storeId,category));
    }



    @GetMapping("/all/product/{productId}/{color}/{size}")
    public ResponseEntity<Long> targetOptionSpecify(@PathVariable Long productId,
                                                    @PathVariable String color,
                                                    @PathVariable String size)
    {
        return ResponseEntity.status(200).body(productService.optionSpcify(productId, color,size));
    }


}
