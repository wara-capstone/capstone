package wara.product.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import wara.product.DTO.OptionDTO;
import wara.product.DTO.ProductDTO;
import wara.product.Service.TransrationService;
import wara.product.Service.ProductService;



import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;


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


    // 단일 상품 조회 상품id
    @GetMapping("/read/one") // null값 처리
    public ProductDTO singleRead(@RequestParam Long productId)
    {
        return productService.readOne(productId);
    }

    // store id 기준 모든 상품 검색
    @GetMapping("/read/many")
    public List<ProductDTO> multiRead(@RequestParam Long storeId){
        return productService.readMany(storeId);
    }

//     카테고리 기준 검색오 만들자
    @GetMapping("/filter")
    public void categoryFilter(@RequestParam String category)
    {

    }

    //상점&카테고리
    @GetMapping("/filter/in-store")
    public void storeCategoryFilter(@RequestParam Long storeId, @RequestParam String category)
    {

    }


    // 상품 등록
    @PostMapping("/registry")
    public String productRegistry(@RequestPart ProductDTO productDTO, @RequestPart OptionDTO optionDTO) throws URISyntaxException, IOException {

        Long productId = productService.initProduct(productDTO);

        if(transrationService.validCheckFromStore(productDTO.getStoreId(),
                Collections.singletonList(productId)).equals("fail"))
        {
            productService.removeOneProduct(productId);
            return HttpStatus.NOT_ACCEPTABLE.toString();
        }

        optionDTO.setBarcodeUrl(transrationService.toBarcode(productDTO.getStoreId(), productDTO.getProductId()));
        productService.addOption(productId,optionDTO);

        return HttpStatus.CREATED.toString();



    }

    // 옵션 등록
    @PutMapping("/option/add")
    public String optionRegistry(@RequestParam Long productId, @RequestPart OptionDTO optionDTO)
    {
        productService.addOption(productId,optionDTO);
        return HttpStatus.OK.toString();
    }

    // 상품 수정
    @PutMapping("/modify")
    public void productModify(@RequestPart ProductDTO productDTO)
    {
        productService.modifyProduct(productDTO);
    }

    //옵션수정
    @PutMapping("/option/modify")
    public void optionModify(@RequestParam Long productId, @RequestPart OptionDTO optionDTO){
        productService.modifyOption(productId, optionDTO);
    }

    // 단일 상품 삭제
    @DeleteMapping("/remove/one")
    public void singleRemove(@RequestParam Long productId)
    {
        productService.removeOneProduct(productId);
    }

    //옵션삭제
    @DeleteMapping("/option/remove")
    public void optionRemove(@RequestParam Long optionId)
    {
        productService.removeoption(optionId);
    }


    // store id 기준 모든 상품 삭제
    @DeleteMapping("/remove/all")
    public void multiRemove(@RequestParam Long storeId){
        productService.removeManyproduct(storeId);
    }



}
