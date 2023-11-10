package wara.product.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import wara.product.DTO.OptionDTO;
import wara.product.DTO.ProductDTO;
import wara.product.Service.TransrationService;
import wara.product.Service.ProductService;


import javax.transaction.Transactional;
import javax.ws.rs.Path;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.Objects;


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
    public String productRegistry(@RequestPart ProductDTO productDTO, @RequestPart OptionDTO optionDTO) throws URISyntaxException, IOException {
        //productDTO의 값으로 일단 저장 -> 해당 상품의 ID값 반환
        Long productId = productService.initProduct(productDTO);


        // STORE서버에 해당 상점이 존재하는지 검사
//        String storeValid = transrationService.validCheckFromStore(productDTO.getStoreId(),
//                Collections.singletonList(productId));

//        if(storeValid.equals("fali"))
//        {// 존재하지 않는 상점이라면
//            //저장한 데이터 삭제
//            productService.removeOneProduct(productId);
//            return HttpStatus.NOT_ACCEPTABLE.toString();
//        } else if (!storeValid.equals("success")) {
//            //RestTamplate 오류라면 HttpStatus 반환
//            productService.removeOneProduct(productId);
//            return  storeValid;
//        }


        if(Objects.isNull(optionDTO)) {// 옵션은 저장하지 않은 경우
            return HttpStatus.CREATED.toString();
        }
        //바코드 URL 반환 후 저장
        optionDTO.setBarcodeUrl(transrationService.toBarcode(productDTO.getStoreId(), productDTO.getProductId()));
        productService.addOption(productId,optionDTO);

        return HttpStatus.CREATED.toString();
    }



    // 옵션 등록
    @PutMapping("/seller/option/add") //TODO:바코드 삭제 로직 필요함
    public String optionRegistry(@RequestParam Long productId, @RequestPart OptionDTO optionDTO) throws URISyntaxException, IOException {
        ProductDTO productDTO = productService.readOne(productId);

        optionDTO.setBarcodeUrl(transrationService.toBarcode(productDTO.getStoreId(), productId));
        return productService.addOption(productId,optionDTO);
    }

    // 상품 수정
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





    // 단일 상품 삭제
    @DeleteMapping("/seller/{productId}")
    public String singleRemove(@PathVariable("id") Long productId)
    {
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
    @GetMapping("/user/{id}")
    public ProductDTO singleRead(@PathVariable("id") Long productId)
    {
        return productService.readOne(productId);
    }


    /**
     * @param productId
     * @param optionId
     * @return 단일 상품, 단일 옵션
     */
    @GetMapping("/user/{storeId}/option/{optionId}")
    public ProductDTO readTargetOption(@PathVariable("storeId") Long productId, @PathVariable("optionId") Long optionId)
    {
        return productService.readTarget(productId,optionId);
    }


    /**
     * @param storeId 상점아이디 기준 모든 상품 검색
     * @return 한 상점의 모든 상품과 옵션
     */
    @GetMapping("/user/store/{storeId}")
    public List<ProductDTO> multiRead(@PathVariable("storeId") Long storeId){
        return productService.readMany(storeId);
    }


    /**
     * @param category 카테고리 기준 모든 상품 검색
     * @return 카테고리와 동잍한 모든 상품 + 옵션
     */
    @GetMapping("/user/category")
    public List<ProductDTO> categoryFilter(@RequestParam String category)
    {
       return productService.categoryFilter(category);
    }

    /**
     * @param storeId
     * @param category
     * @return 상품아이디&카테고리에 해당하는 모든 상품+ 옵션
     */
    @GetMapping("/user/store/{storeId}/category")
    public List<ProductDTO> storeCategoryFilter(@PathVariable("storeId") Long storeId, @RequestParam String category)
    {
        return productService.storeCategoryFilter(storeId,category);
    }






}
