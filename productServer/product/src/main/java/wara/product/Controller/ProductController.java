package wara.product.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.util.annotation.Nullable;
import wara.product.DTO.OptionDTO;
import wara.product.DTO.ProductDTO;
import wara.product.DTO.SortDTO;
import wara.product.Service.TranslationService;
import wara.product.Service.ProductService;


import javax.transaction.Transactional;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;


@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final TranslationService translationService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    public ProductController(@Autowired ProductService productService,
                             @Autowired TranslationService translationService) {
        this.productService = productService;
        this.translationService = translationService;
    }


    //TODO: 찾는 정보가 없는 경우에 대한 핸들링이 필요함
    //TODO: 핸들링 커스텀 해야함
    /**
     * @param e Controller의 NullPointerException에 대한 핸들링
     * @return
     */
//    @ExceptionHandler(NullPointerException.class)
//    public ResponseEntity<String> nullPointerExceptionControl(Exception e)
//    {
//        return ResponseEntity.status(400).body("nullllll");
//    }



    /**
     * @param productDTO
     * @param optionDTO
     * @return
     * @throws URISyntaxException
     * @throws IOException
     */
    //TODO: service 호출 로직 이외의 것들 분리
    @PostMapping("/seller")
    public ResponseEntity<ProductDTO> productRegistry(@RequestPart ProductDTO productDTO,
                                                      @RequestPart@Nullable OptionDTO optionDTO,
                                                      @RequestPart@Nullable List<MultipartFile> images) throws URISyntaxException, IOException
    {
        logger.info("\n[productRegistry] 상품 등록");
        logger.info("전달받은 productDTO: " + productDTO.toString());

        ProductDTO response = productService.initProduct(productDTO, optionDTO, images);

        logger.info("반환된 값: " + productDTO);

        return ResponseEntity.status(200).body(response);
    }

    @PutMapping("/seller/product/{productId}")
    public ResponseEntity<String> productImageRegistry(@PathVariable("productId") Long productId,
                                                       @RequestPart List<MultipartFile> images) throws URISyntaxException, IOException
    {
        List<String> urls = translationService.uploadImage(images);
        logger.info("\n[product images registry] 상품 사진 정보 수정");
        logger.info("[상품 id]:" + productId.toString());
        logger.info("[발급받은 URLs]" + urls.toString());

        ProductDTO latest = productService.modifyImage(productId, urls);

        logger.info("[저장된 값]" + latest);

        return ResponseEntity.status(200).body("");
    }


    // 옵션 등록
    //TODO:바코드 삭제 로직 필요함
    @PutMapping("/seller/option/add/product/{productId}")
    public ResponseEntity<Long> optionRegistry(@PathVariable("productId") Long productId,
                                 @RequestBody OptionDTO optionDTO) throws URISyntaxException, IOException
    {
        logger.info("\n[option registry] 옵션 등록");
        logger.info("productId : "+productId);
        logger.info(optionDTO.toString());

        productService.getProductAndOptions(productId); //TODO: 상품이 존재하지 않는 경우 처리

        Long latestId = productService.addOption(productId,optionDTO);

        return  ResponseEntity.status(200).body(latestId);
    }

    //옵션수정
    //TODO: op
    @PutMapping("/seller/option/{productId}")
    public ResponseEntity<String> optionModify(@PathVariable("productId") Long productId,
                                               @RequestBody OptionDTO optionDTO) throws URISyntaxException, IOException
    {
        logger.info("\n[option modify] 옵션 수정");
        logger.info("productId : "  + productId);
        logger.info(optionDTO.toString());

        productService.modifyOption(optionDTO);

        return ResponseEntity.status(200).body("");
    }

    // 상품 수정
    //TODO: 사진 있는경우, 없는경우 분리
    @PutMapping("/seller")
    public ResponseEntity<String> productModify(@RequestPart ProductDTO productDTO)
    {
        logger.info("\n[product Modify] 상품정보 수정\n");
        logger.info("\n[수정 전 값]" + productDTO.toString());

        ProductDTO result = productService.modifyProduct(productDTO);

        logger.info("\n[수정 후]" + result);

        return  ResponseEntity.status(200).body("");
    }



    @PutMapping("/user/product/{productId}/{optionId}/{stockModify}")
    public ResponseEntity<String> stockModify(
            @PathVariable("productId") Long productId,
            @PathVariable("optionId") Long optionId,
            @PathVariable("stockModify") String stockModify)
    {
        logger.info("\n[stock modify] 재고 수정");
        logger.info("productId : " +productId);
        logger.info("optionId : "+optionId);
        logger.info("update stock size : "+ stockModify + "개");

        OptionDTO latest = productService.modifyStock(productId,optionId,stockModify);

        logger.info("\n[수정된 값] " + latest);

        return  ResponseEntity.status(200).body("");
    }


    // 단일 상품 삭제
    @DeleteMapping("/seller/{storeId}/{productId}") @Transactional
    public ResponseEntity<String> singleRemove(
            @PathVariable("storeId")Long storeId,
            @PathVariable("productId") Long productId)
            throws URISyntaxException, IOException
    {
        logger.info("\n[single product remove] 단일상품 삭제 ");
        logger.info("storeId : "+storeId);
        logger.info("productId : "+ productId);

        translationService.removeToStore(storeId, productId);
        productService.deleteProduct(productId);

        return ResponseEntity.status(200).body("");
    }

    //옵션삭제
    @DeleteMapping("/seller/option/{optionId}")
    public ResponseEntity<String> optionRemove(@PathVariable("optionId") Long optionId)
    {
        logger.info("\n[option remove] 단일 옵션 삭제");
        logger.info("optionId : "+optionId);

        productService.deleteOption(optionId);

        return ResponseEntity.status(200).body("");
    }


    // store id 기준 모든 상품 삭제
    @DeleteMapping("/seller/store/{storeId}")
    public ResponseEntity<String> multiRemove(@PathVariable("storeId") Long storeId)
    {
        logger.info("\n[multi product remove] 상점아이디 기준 모든 상품 삭제");
        logger.info("storeId : "+storeId);
        productService.deleteAllProductByStoreId(storeId);
        return ResponseEntity.status(200).body("");
    }



    /**
     * @param productId 상품 아이디 기준 검색
     * @return 단일 상품의 정보와 해당 상품의 모든 옵션
     */
    @GetMapping("/all/{id}")
    public ResponseEntity<ProductDTO> singleRead(@PathVariable("id") Long productId)
    {
        logger.info("\n[single product read] 단일 상품 모든 옵션 검색");
        logger.info("productId : "+productId);

        return ResponseEntity.status(200).body(productService.getProductAndOptions(productId));
    }


    /**
     * @param productId
     * @param optionId
     * @return 단일 상품, 단일 옵션
     */
    @GetMapping("/all/{productId}/option/{optionId}")
    public ResponseEntity<ProductDTO> readTargetOption(
            @PathVariable("productId") Long productId,
            @PathVariable("optionId") Long optionId)
    {
        logger.info("\n[read target option] 상품 단일 옵션조회");
        logger.info("productId : "+productId);
        logger.info("optionId : "+optionId);

        ProductDTO target = productService.getProductAndOption(productId,optionId);

        logger.info("\n[조회한 값]" + target);

        return ResponseEntity.status(200).body(target);
    }


    /**
     * @param storeId 상점아이디 기준 모든 상품 검색
     * @return 한 상점의 모든 상품과 옵션
     */
    @GetMapping("/all/store/{storeId}")
    public ResponseEntity<List<ProductDTO>> multiRead(@PathVariable("storeId") Long storeId)
    {
        logger.info("\n[multi read] 상점아이디 기준 모든 상품 검색");
        logger.info("storeId : "+storeId);

        return ResponseEntity.status(200).body(productService.getProductsAndOptionsByStoreId(storeId));
    }


    @GetMapping("/all/product/{productId}/{color}/{size}")
    public ResponseEntity<OptionDTO> targetOptionSpecify(@PathVariable Long productId,
                                                    @PathVariable String color,
                                                    @PathVariable String size)
    {
        logger.info("\n[target option specify] 컬러 사이즈 기반 옵션 아이디 조회 ");
        logger.info("productId : "+productId);
        logger.info("color : "+color);
        logger.info("size : "+size);

        OptionDTO response = productService.findOptionByProductIdAndColorAndSize(productId, color,size);

        logger.info("[반환값]");
        logger.info("[option ID]: " + response.getOptionId());
        logger.info("[Stock]: " + response.getProductStock());

        return ResponseEntity.status(200).body(response);
    }



    // 검색 정렬

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
        logger.info("\n[store category filter] 상점아이디 & 카테고리 기준 검색");
        logger.info("storeId : "+storeId);
        logger.info("category : "+category);

        return ResponseEntity.status(200).body(productService.findAllProductsByStoreIdAndCategory(storeId,category));
    }



    /**
     * @param category 카테고리 기준 모든 상품 검색
     * @return 카테고리와 동잍한 모든 상품 + 옵션
     */
    @GetMapping("/all/category/{category}")
    public ResponseEntity<List<ProductDTO>> categoryFilter(
            @PathVariable("category") String category)
    {
        logger.info("\n[category filter] 카테고리기준 상품 검색");
        logger.info("category : "+category);

        return ResponseEntity.status(200).body(productService.findAllProductsByCategory(category));
    }


//    @GetMapping("/all/search-keyword/{keyword}")
//    public ResponseEntity<List<ProductDTO>> searchByKeyword(@PathVariable String keyword)
//    {
//        logger.info("User input keyword: " + keyword);
//
//    }



    @GetMapping("/all/{condition}/{keyword}")
    public ResponseEntity<List<SortDTO>> searchTargetByType(@PathVariable(value = "condition") String condition,
                                                              @PathVariable(value = "keyword") String keyword)
    {
        return ResponseEntity.status(200).body(productService.sortTest(condition, "search", keyword));
    }

    @GetMapping("/all/sort/{condition}/{type}/{keyword}")
    public ResponseEntity<List<SortDTO>> sortByCondition(@PathVariable("condition") String condition,
                                                         @PathVariable("type") String type,
                                                         @PathVariable("keyword") String keyword){
        return ResponseEntity.status(200).body(productService.sortTest(condition, type, keyword));
    }
}
