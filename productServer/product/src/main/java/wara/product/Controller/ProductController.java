package wara.product.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public Object nullPointerExceptionControl(Exception e)
    {
        return "NullPointerException 발생";
    }





    /**
     * @param productDTO
     * @param optionDTO
     * @return
     * @throws URISyntaxException
     * @throws IOException
     */
    @PostMapping("/seller") @Transactional
    public String productRegistry(@RequestPart ProductDTO productDTO, @RequestPart OptionDTO optionDTO, @RequestPart List<MultipartFile> images) throws URISyntaxException, IOException {

        productDTO.setProductUrls(transrationService.uploadImage(images));
        //productDTO의 값으로 일단 저장 -> 해당 상품의 ID값 반환
        Long productId = productService.initProduct(productDTO);

        // STORE서버에 해당 상점이 존재하는지 검사
        String storeValid = transrationService.
                initToStore(productDTO.getStoreId(), Collections.singletonList(productId));

        if(!storeValid.equals("success"))
        {
            productService.removeOneProduct(productId);
            return "존재하지 않는 상점";
        }

        if(Objects.nonNull(optionDTO)){
            return productService.addOption(productId,optionDTO);
        }

        return HttpStatus.CREATED.toString();
    }



    // 옵션 등록
    @PutMapping("/seller/option/add/product/{productId}") //TODO:바코드 삭제 로직 필요함
    public String optionRegistry(@PathVariable("productId") Long productId,
                                 @RequestBody OptionDTO optionDTO) throws URISyntaxException, IOException {
        productService.readOne(productId); //TODO: 상품이 존쟈하지 않는경우 처리
        return productService.addOption(productId,optionDTO);
    }

    // 상품 수정
    //TODO: 사진 있는경우, 없는경우 분리
    @PutMapping("/seller")
    public String productModify(@RequestPart ProductDTO productDTO)
    {
        return productService.modifyProduct(productDTO);

    }

    //옵션수정
    @PutMapping("/seller/option/{productId}")
    public String optionModify(@PathVariable("productId") Long productId, @RequestPart OptionDTO optionDTO){
        return productService.modifyOption(productId, optionDTO);
    }

    @PutMapping("/user/product/{productId}/{optionId}/{stockModify}")
    public String stockModify(@PathVariable("productId") Long productId,
                              @PathVariable("optionId") Long optionId,
                              @PathVariable("stockModify") String stockModify)
    {
        return productService.stockModify(productId,optionId,stockModify);
    }




    // 단일 상품 삭제
    @DeleteMapping("/seller/{storeId}/{productId}") @Transactional
    public String singleRemove(@PathVariable("storeId")Long storeId, @PathVariable("productId") Long productId) throws URISyntaxException, IOException {
        transrationService.removeToStore(storeId, productId);
        return productService.removeOneProduct(productId);
    }

    //옵션삭제
    @DeleteMapping("/seller/option/{optionId}")
    public String optionRemove(@PathVariable("optionId") Long optionId)
    {
        return productService.removeOption(optionId);
    }


    // store id 기준 모든 상품 삭제
    @DeleteMapping("/seller/store/{storeId}")
    public String multiRemove(@PathVariable("storeId") Long storeId){
        return productService.removeManyproduct(storeId);
    }







    /**
     * @param productId 상품 아이디 기준 검색
     * @return 단일 상품의 정보와 해당 상품의 모든 옵션
     */
    @GetMapping("/all/{id}")
    public ProductDTO singleRead(@PathVariable("id") Long productId)
    {
        return productService.readOne(productId);
    }


    /**
     * @param productId
     * @param optionId
     * @return 단일 상품, 단일 옵션
     */
    @GetMapping("/all/{productId}/option/{optionId}")
    public ProductDTO readTargetOption(@PathVariable("productId") Long productId, @PathVariable("optionId") Long optionId)
    {
        return productService.readTarget(productId,optionId);
    }


    /**
     * @param storeId 상점아이디 기준 모든 상품 검색
     * @return 한 상점의 모든 상품과 옵션
     */
    @GetMapping("/all/store/{storeId}")
    public List<ProductDTO> multiRead(@PathVariable("storeId") Long storeId){
        return productService.readMany(storeId);
    }


    /**
     * @param category 카테고리 기준 모든 상품 검색
     * @return 카테고리와 동잍한 모든 상품 + 옵션
     */
    @GetMapping("/all/category/{category}")
    public List<ProductDTO> categoryFilter(@PathVariable("category") String category)
    {
       return productService.categoryFilter(category);
    }

    /**
     * @param storeId
     * @param category
     * @return 상점아이디&카테고리에 해당하는 모든 상품 + 옵션
     */
    @GetMapping("/all/store/{storeId}/category")
    public List<ProductDTO> storeCategoryFilter(
            @PathVariable("storeId") Long storeId,
            @RequestParam String category)
    {
        return productService.storeCategoryFilter(storeId,category);
    }



    @GetMapping("/all/product/{productId}/{color}/{size}")
    public Long targetOptionSpecify(@PathVariable Long productId,
                                    @PathVariable String color,
                                    @PathVariable String size)
    {
        return productService.optionSpcify(productId, color,size);
    }


}
