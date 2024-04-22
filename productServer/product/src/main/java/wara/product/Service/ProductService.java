package wara.product.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import wara.product.DAO.ProductDAO;
import wara.product.DTO.OptionDTO;
import wara.product.DTO.ProductDTO;
import wara.product.DTO.SortDTO;
import wara.product.DTO.UrlDTO;
import wara.product.productEntity.OptionEntity;
import wara.product.productEntity.ProductEntity;
import wara.product.productEntity.UrlEntity;

import javax.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


@Service
public class ProductService {

    private final ProductDAO productDAO;
    private final TranslationService translationService;
    private final Logger logger = LoggerFactory.getLogger(ProductService.class);

    public ProductService(@Autowired ProductDAO productDAO,
                          @Autowired TranslationService translationService) {
        this.productDAO = productDAO;
        this.translationService = translationService;
    }



    /**
     * @param productId
     * @return 단일상품과 해당 상품의 모든 옵션
     */
    public ProductDTO getProductAndOptions(Long productId){
        ProductEntity productEntity = productDAO.readOneProduct(productId);
        List<OptionEntity> optionEntityList =  productDAO.readOptions(productEntity);

        return new ProductDTO(productEntity, optionEntityList);
    }

    public ProductDTO getProductAndOption(Long productId, Long optionId)
    {
        ProductEntity productEntity =  productDAO.readOneProduct(productId);
        OptionEntity optionEntity = productDAO.readTargetoption(optionId);
        return new ProductDTO(productEntity,optionEntity);
    }


    /**
     * 한 상점의 모든 상품 정보 조회
     *
     * @return
     */
    public List<ProductDTO> getProductsAndOptionsByStoreId(Long storeId)
    {

        List<ProductEntity> productEntities = productDAO.readManyProduct(storeId);
        List<ProductDTO> productDTOS = new ArrayList<>();
        for(var item: productEntities) { productDTOS.add(item.toDTO()); }

        return productDTOS;
    }


    /**
     * 상품 최초 등록
     * @param
     * @return productID
     */
    @Transactional
    public ProductDTO initProduct(ProductDTO productDTO,
                            OptionDTO optionDTO,
                            List<MultipartFile> images) throws URISyntaxException, IOException {


        List<UrlDTO> urls = new ArrayList<>();
        try {logger.info(optionDTO.toString());
        } catch (NullPointerException e) {logger.info("[optoinDTO없음]");}


        Long productId = productDAO.initProduct(productDTO.toEntity());
        ProductEntity productEntity = productDAO.readOneProduct(productId);

        try {
            for(String url:translationService.uploadImage(images))
            {
                urls.add(new UrlDTO(0L, url));
            }
            productDTO.setProductUrls(urls);
        } catch (NullPointerException | URISyntaxException | IOException e)
        {
            logger.info("사진 업로드 실패");
            // 첨부된 사진이 없으면 기본 사진으로 대체
            urls.add(new UrlDTO("https://www.onoff.zone/api/image/download/1"));
            productDTO.setProductUrls(urls);
        }

        List<UrlEntity> urlEntities = new ArrayList<>();

        for(var item:urls)
        {
            urlEntities.add(new UrlEntity(productEntity, item.getUrl()));
        }
        productEntity.setImageUrls(urlEntities);

        logger.info(urlEntities.toString());
        logger.info(productEntity.getImageUrls().toString());

        productDAO.initProduct(productEntity);

        //productDTO의 값으로 일단 저장 -> 해당 상품의 ID값 반환



        // STORE서버에 해당 상점이 존재하는지 검사
//        String storeValid = transrationService.initToStore(productDTO.getStoreId(), Collections.singletonList(productId));
//
//        if(!storeValid.equals("success"))
//        {//상점이 존재하지 않는 경우 -> 삭제
//            logger.info("존재하지 않는 상점");
//            productDAO.removeOneProduct(productId);
//        }else if(Objects.nonNull(optionDTO)){
//            // 옵션, 바코드 URL 추가 후 저장
//            OptionEntity optionIdAfterSave = productDAO.getOptionIdAfterSave(productId,optionDTO.toEntity());
//            String barcodeUrl = transrationService.toBarcode(productId, optionIdAfterSave.getOptionId());
//            productDAO.addOption(productId,new OptionEntity(optionIdAfterSave,barcodeUrl));
//        }

        //TODO: 테스트 후 삭제
        OptionEntity optionIdAfterSave = productDAO.getOptionIdAfterSave(productId,optionDTO.toEntity());
//        String barcodeUrl = transrationService.toBarcode(productId, optionIdAfterSave.getOptionId());
        String barcodeUrl = "https://www.onoff.zone/api/image/download/1";
        productDAO.addOption(productId,new OptionEntity(optionIdAfterSave,barcodeUrl));

        return productDAO.readOneProduct(productId).toDTO();
    }



    public ProductDTO modifyProduct(ProductDTO productDTO)
    {// 상품이 존재하는지 확인 할 것
        ProductEntity productEntity = this.productDAO.readOneProduct(productDTO.getProductId());
        productEntity.setName(productDTO.getProductName());
        productEntity.setCategory(productDTO.getProductCategory());

        return productDAO.modifyProduct(productEntity).toDTO();
    }

    public ProductDTO modifyImage(Long productId, List<String> urls)
    {
        ProductEntity productEntity = productDAO.readOneProduct(productId);

        List<UrlEntity> urlEntities = new ArrayList<>();

        for(String url:urls)
        {
            urlEntities.add(new UrlEntity(productEntity, url));
        }
        productEntity.setImageUrls(urlEntities);


        return productDAO.modifyProduct(productEntity).toDTO();
    }


    @Transactional
    public String deleteProduct(Long productId)
    {
        return productDAO.removeOneProduct(productId);
    }

    @Transactional
    public String deleteAllProductByStoreId(Long storeId)
    {
        return productDAO.removeManyProduct(storeId);
    }




    @Transactional
    public Long addOption(Long productId, OptionDTO optionDTO) throws URISyntaxException, IOException {
        OptionEntity optionIdAfterSave = productDAO.getOptionIdAfterSave(productId,optionDTO.toEntity());
        //TODO: 테스트 후 원상복구
        //        String barcodeUrl = transrationService.toBarcode(productId, optionIdAfterSave.getOptionId());
        String barcodeUrl = "testURL";
        return productDAO.addOption(productId,new OptionEntity(optionIdAfterSave,barcodeUrl));
    }


    public String modifyOption(OptionDTO newOption) throws URISyntaxException, IOException {
        OptionEntity old = productDAO.getOption(newOption.getOptionId());
        logger.info("옵션 수정 전: " + old);
        old.modify(newOption.toEntity());

//        String barcodeUrl = transrationService.toBarcode(productId,oldOption.getOptionId());
        return productDAO.modifyOption(old);

    }


    //TODO: 삭제 성공, 실패 구분
    @Transactional
    public String deleteOption(Long optionId)
    {
        productDAO.removeOption(optionId);
        return HttpStatus.OK.toString();
    }



    public List<ProductDTO> findAllProductsByCategory(String category)
    {
        List<ProductEntity> productEntities =  productDAO.categoryFilter(category);
        List<ProductDTO> productDTOS = new ArrayList<>();
        for(var item: productEntities) { productDTOS.add(item.toDTO()); }
        return productDTOS;
    }


    public List<ProductDTO> findAllProductsByStoreIdAndCategory(Long storeId, String category)
    {
        List<ProductEntity> productEntities =  productDAO.storeCategoryFilter(storeId, category);
        List<ProductDTO> productDTOS = new ArrayList<>();
        for(var item: productEntities) { productDTOS.add(item.toDTO()); }
        return productDTOS;
    }


    public OptionDTO modifyStock(Long productId, Long optionId, String stockModify)
    {
        return productDAO.stockModify(optionId,stockModify).toDTO();
    }

    public OptionDTO findOptionByProductIdAndColorAndSize(Long productId, String color, String size)
    {
        return productDAO.optionSpecify(productId,color,size).toDTO();
    }

    // 검색 & 정렬
    public List<SortDTO> sortTest(String condition, String type, String keyword, Pageable pageable)
    {
        return productDAO.sortTest(condition, type, keyword, pageable);
    }


}
