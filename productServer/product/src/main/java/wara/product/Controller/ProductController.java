package wara.product.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
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
@RequestMapping("/product")
public class ProductController {

    private final ProductService productService;
    private final TransrationService transrationService;

    public ProductController(@Autowired ProductService productService,
                             @Autowired TransrationService transrationService) {
        this.productService = productService;
        this.transrationService = transrationService;
    }

    @ExceptionHandler(NullPointerException.class)
    public Object nullPointerExceptionControl(Exception e)
    {
        return "NullPointerException 발생";
    }


    // 단일 상품 + 모든 옵션
    @GetMapping("/read/one") // null값 처리
    public ProductDTO singleRead(@RequestParam Long productId)
    {
        return productService.readOne(productId);
    }
    @GetMapping("/read/target/option")
    public ProductDTO readTargetOption(@RequestParam Long productId, @RequestParam Long optionId)
    {
        return productService.readTarget(productId,optionId);
    }


    // store id 기준 모든 상품 검색
    @GetMapping("/read/many")
    public List<ProductDTO> multiRead(@RequestParam Long storeId){
        return productService.readMany(storeId);
    }

//     카테고리 기준 검색
    @GetMapping("/filter")
    public List<ProductDTO> categoryFilter(@RequestParam String category)
    {
       return productService.categoryFilter(category);
    }

    //상점&카테고리
    @GetMapping("/filter/in-store")
    public List<ProductDTO> storeCategoryFilter(@RequestParam Long storeId, @RequestParam String category)
    {
        return productService.storeCategoryFilter(storeId,category);
    }



    // 상품 등록
    @PostMapping("/registry") @Transactional
    public String productRegistry(@RequestPart ProductDTO productDTO, @RequestPart OptionDTO optionDTO) throws URISyntaxException, IOException {

        Long productId = productService.initProduct(productDTO);

        if(transrationService.validCheckFromStore(productDTO.getStoreId(),
                Collections.singletonList(productId)).equals("fail"))
        {
            productService.removeOneProduct(productId);
            return HttpStatus.NOT_ACCEPTABLE.toString();
        }


        if(Objects.isNull(optionDTO))
        {
            return HttpStatus.CREATED.toString();
        }

        optionDTO.setBarcodeUrl(transrationService.toBarcode(productDTO.getStoreId(), productDTO.getProductId()));
        productService.addOption(productId,optionDTO);

        return HttpStatus.CREATED.toString();
    }

    // 옵션 등록
    @PutMapping("/option/add") //TODO:바코드 삭제 로직 필요함
    public String optionRegistry(@RequestParam Long productId, @RequestPart OptionDTO optionDTO) throws URISyntaxException, IOException {
        ProductDTO productDTO = productService.readOne(productId);

        optionDTO.setBarcodeUrl(transrationService.toBarcode(productDTO.getStoreId(), productId));
        return productService.addOption(productId,optionDTO);
    }

    // 상품 수정
    @PutMapping("/modify")
    public String productModify(@RequestPart ProductDTO productDTO)
    {
        return productService.modifyProduct(productDTO);

    }

    //옵션수정
    @PutMapping("/option/modify")
    public String optionModify(@RequestParam Long productId, @RequestPart OptionDTO optionDTO){
        return productService.modifyOption(productId, optionDTO);
    }

    // 단일 상품 삭제
    @DeleteMapping("/remove/one")
    public String singleRemove(@RequestParam Long productId)
    {
        return productService.removeOneProduct(productId);
    }

    //옵션삭제
    @DeleteMapping("/option/remove")
    public String optionRemove(@RequestParam Long optionId)
    {
        return productService.removeoption(optionId);
    }


    // store id 기준 모든 상품 삭제
    @DeleteMapping("/remove/all")
    public String multiRemove(@RequestParam Long storeId){
       return productService.removeManyproduct(storeId);
    }



}
