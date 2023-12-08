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
import wara.product.Service.TransrationService;
import wara.product.Service.ProductService;


import javax.transaction.Transactional;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;


@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
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
    public ResponseEntity<ProductDTO> productRegistry(@RequestPart ProductDTO productDTO,
                                                      @RequestPart@Nullable OptionDTO optionDTO,
                                                      @RequestPart@Nullable List<MultipartFile> images) throws URISyntaxException, IOException {
        logger.info("\n[productRegistry] 상품 등록");
        logger.info("전달받은 productDTO: " + productDTO.toString());

        ProductDTO responseDTO = new ProductDTO();
        List<String> imagesURLs = new ArrayList<>();

        try {logger.info(optionDTO.toString());
        } catch (NullPointerException e) {logger.info("[optoinDTO없음]");}


        try {
            imagesURLs = transrationService.uploadImage(images);
            productDTO.setProductUrls(imagesURLs);
            responseDTO.setProductUrls(imagesURLs);
            logger.info("[사진등록]:성공");
        } catch (NullPointerException e)
        {
            logger.info("[사진등록]:실패 -> 사유:사진값을 수신하지 않았음");
            productDTO.setProductUrls(Collections.singletonList("https://www.onoff.zone/api/image/download/1"));
            responseDTO.setProductUrls(Collections.singletonList("https://www.onoff.zone/api/image/download/1"));
        }

        //productDTO의 값으로 일단 저장 -> 해당 상품의 ID값 반환
        Long productId = productService.initProduct(productDTO);
        responseDTO.setProductId(productId);

        // STORE서버에 해당 상점이 존재하는지 검사
        String storeValid = transrationService.initToStore(productDTO.getStoreId(), Collections.singletonList(productId));


        if(!storeValid.equals("success"))
        {//상점이 존재하지 않는 경우
            logger.info("! 상점이 존재하지 않음 !");
            productService.removeOneProduct(productId);
            return ResponseEntity.status(400).body(new ProductDTO());
        }

        if(Objects.nonNull(optionDTO)){
            productService.addOption(productId,optionDTO);

            logger.info("[반환된 값]: " + responseDTO);
            return ResponseEntity.status(200).body(responseDTO);
        }


        logger.info("[반환된 값]: " + responseDTO);

        return ResponseEntity.status(200).body(responseDTO);
    }

    @PutMapping("/seller/product/{productId}")
    public ResponseEntity<String> productIamgeRegistry(@PathVariable("productId") Long productId,
                                                       @RequestPart List<MultipartFile> images) throws URISyntaxException, IOException {

        List<String> urls = transrationService.uploadImage(images);
        logger.info("\n[product images registry] 상품 사진 정보 수정");
        logger.info("[상품 id]:" + productId.toString());
        logger.info("[발급받은 URLs]" + urls.toString());


        ProductDTO latest = productService.modifyimage(productId, urls);
        logger.info("[저장된 값]" + latest);


        return ResponseEntity.status(200).body("");
    }






    // 옵션 등록
    @PutMapping("/seller/option/add/product/{productId}") //TODO:바코드 삭제 로직 필요함
    public ResponseEntity<Long> optionRegistry(@PathVariable("productId") Long productId,
                                 @RequestBody OptionDTO optionDTO) throws URISyntaxException, IOException {
        logger.info("\n[option registry] 옵션 등록");
        logger.info("productId : "+productId);
        logger.info(optionDTO.toString());
        productService.readOne(productId); //TODO: 상품이 존재하지 않는 경우 처리
        Long latestId = productService.addOption(productId,optionDTO);

        return  ResponseEntity.status(200).body(latestId);
    }

    //옵션수정
    //TODO: op
    @PutMapping("/seller/option/{productId}")
    public ResponseEntity<String> optionModify(@PathVariable("productId") Long productId,
                                               @RequestBody OptionDTO optionDTO) throws URISyntaxException, IOException {
        logger.info("\n[option modify] 옵션 수정");
        logger.info("productId : "  + productId);
        logger.info(optionDTO.toString());

        productService.modifyOption(productId, optionDTO);

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
        OptionDTO latest = productService.stockModify(productId,optionId,stockModify);
        logger.info("\n[수정된 값] " + latest);

        return  ResponseEntity.status(200).body("");
    }




    // 단일 상품 삭제
    @DeleteMapping("/seller/{storeId}/{productId}") @Transactional
    public ResponseEntity<String> singleRemove(
            @PathVariable("storeId")Long storeId,
            @PathVariable("productId") Long productId)
            throws URISyntaxException, IOException {
        logger.info("\n[single product remove] 단일상품 삭제 ");
        logger.info("storeId : "+storeId);
        logger.info("productId : "+ productId);
        transrationService.removeToStore(storeId, productId);
        productService.removeOneProduct(productId);
        return ResponseEntity.status(200).body("");
    }

    //옵션삭제
    @DeleteMapping("/seller/option/{optionId}")
    public ResponseEntity<String> optionRemove(@PathVariable("optionId") Long optionId)
    {
        logger.info("\n[option remove] 단일 옵션 삭제");
        logger.info("optionId : "+optionId);
        productService.removeOption(optionId);
        return ResponseEntity.status(200).body("");
    }


    // store id 기준 모든 상품 삭제
    @DeleteMapping("/seller/store/{storeId}")
    public ResponseEntity<String> multiRemove(@PathVariable("storeId") Long storeId){
        logger.info("\n[multi product remove] 상점아이디 기준 모든 상품 삭제");
        logger.info("storeId : "+storeId);
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
        logger.info("\n[single product read] 단일 상품 모든 옵션 검색");
        logger.info("productId : "+productId);

        return ResponseEntity.status(200).body(productService.readOne(productId));
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

        ProductDTO target = productService.readTarget(productId,optionId);
        logger.info("\n[조회한 값]" + target);

        return ResponseEntity.status(200).body(target);
    }


    /**
     * @param storeId 상점아이디 기준 모든 상품 검색
     * @return 한 상점의 모든 상품과 옵션
     */
    @GetMapping("/all/store/{storeId}")
    public ResponseEntity<List<ProductDTO>> multiRead(@PathVariable("storeId") Long storeId){
        logger.info("\n[multi read] 상점아이디 기준 모든 상품 검색");
        logger.info("storeId : "+storeId);

        return ResponseEntity.status(200).body(productService.readMany(storeId));
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
        logger.info("\n[store category filter] 상점아이디 & 카테고리 기준 검색");
        logger.info("storeId : "+storeId);
        logger.info("category : "+category);
        return ResponseEntity.status(200).body(productService.storeCategoryFilter(storeId,category));
    }



    @GetMapping("/all/product/{productId}/{color}/{size}")
    public ResponseEntity<Long> targetOptionSpecify(@PathVariable Long productId,
                                                    @PathVariable String color,
                                                    @PathVariable String size)
    {
        logger.info("\n[target option specify] 컬러 사이즈 기반 옵션 아이디 조회 ");
        logger.info("productId : "+productId);
        logger.info("color : "+color);
        logger.info("size : "+size);
        return ResponseEntity.status(200).body(productService.optionSpcify(productId, color,size));
    }


}
