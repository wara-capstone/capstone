package wara.product.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import wara.product.DAO.ProductDAO;
import wara.product.DTO.OptionDTO;
import wara.product.DTO.ProductDTO;
import wara.product.productEntity.OptionEntity;
import wara.product.productEntity.ProductEntity;
import wara.product.productEntity.Urls;

import javax.transaction.Transactional;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;


@Service
public class ProductService {

    private final ProductDAO productDAO;
    private final TransrationService transrationService;

    public ProductService(@Autowired ProductDAO productDAO,
                          @Autowired TransrationService transrationService) {
        this.productDAO = productDAO;
        this.transrationService = transrationService;
    }


    /**
     * @param productId
     * @return 단일상품과 해당 상품의 모든 옵션
     */
    public ProductDTO readOne(Long productId){
        ProductEntity productEntity = productDAO.readOneProduct(productId);
        List<OptionEntity> optionEntityList =  productDAO.readOptions(productEntity);

        return new ProductDTO(productEntity, optionEntityList);
    }

    public ProductDTO readTarget(Long productId, Long optionId)
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
    public List<ProductDTO> readMany(Long storeId)
    {
        List<ProductEntity> productEntities = productDAO.readManyProduct(storeId);
        List<ProductDTO> productDTOS = new ArrayList<>();
        for(var item: productEntities) { productDTOS.add(item.toDTO()); }

        return productDTOS;
    }


    /**
     * 최초 상품 등록에 대한 비즈니스 로직
     * @param dto
     * @return productID
     */
    public Long initProduct(ProductDTO dto)
    {
        return productDAO.initProduct(dto.toEntity());
    }


    public ProductDTO modifyProduct(ProductDTO productDTO)
    {// 상품이 존재하는지 확인 할 것
        ProductEntity productEntity = this.productDAO.readOneProduct(productDTO.getProductId());
        productEntity.setProductName(productDTO.getProductName());
        productEntity.setProductCategory(productDTO.getProductCategory());

        return productDAO.modifyProduct(productEntity).toDTO();
    }

    public ProductDTO modifyimage(Long productId, List<String> urls)
    {
        ProductEntity productEntity = productDAO.readOneProduct(productId);
        Urls a = new Urls(urls);
        productEntity.setProductUrls(a);
        return productDAO.modifyProduct(productEntity).toDTO();
    }


    @Transactional
    public String removeOneProduct(Long productId)
    {
        return productDAO.removeOneProduct(productId);
    }

    @Transactional
    public String removeManyproduct(Long storeId)
    {
        return productDAO.removeManyProduct(storeId);
    }




    @Transactional
    public Long addOption(Long productId, OptionDTO optionDTO) throws URISyntaxException, IOException {
        OptionEntity optionIdAfterSave = productDAO.getOptionIdAfterSave(productId,optionDTO.toEntity());
        String barcodeUrl = transrationService.toBarcode(productId, optionIdAfterSave.getOptionId());

        return productDAO.addOption(productId,new OptionEntity(optionIdAfterSave,barcodeUrl));
    }


    public String modifyOption(Long productId, OptionDTO optionDTO) throws URISyntaxException, IOException {
        OptionEntity option = new OptionEntity();
        ProductEntity product = productDAO.readOneProduct(productId);
        option.setProduct(product);

        option.setOptionId(optionDTO.getOptionId());
        String barcodeUrl = transrationService.toBarcode(productId,optionDTO.getOptionId());

        System.out.println(barcodeUrl);
        option.setBarcodeUrl(barcodeUrl);
        option.setProductColor(optionDTO.getProductColor());
        option.setProductPrice(optionDTO.getProductPrice());
        option.setProductSize(optionDTO.getProductSize());
        option.setProductStock(optionDTO.getProductStock());


        return productDAO.modifyOption(productId,option);
    }


    @Transactional
    public String removeOption(Long optionId)
    {
        productDAO.removeOption(optionId);
        return HttpStatus.OK.toString();
    }



    public List<ProductDTO> categoryFilter(String category)
    {
        List<ProductEntity> productEntities =  productDAO.categoryFilter(category);
        List<ProductDTO> productDTOS = new ArrayList<>();
        for(var item: productEntities) { productDTOS.add(item.toDTO()); }
        return productDTOS;
    }


    public List<ProductDTO> storeCategoryFilter(Long storeId, String category)
    {
        List<ProductEntity> productEntities =  productDAO.storeCategoryFilter(storeId, category);
        List<ProductDTO> productDTOS = new ArrayList<>();
        for(var item: productEntities) { productDTOS.add(item.toDTO()); }
        return productDTOS;
    }


    public OptionDTO stockModify(Long productId, Long optionId, String stockModify)
    {
        return productDAO.stockModify(optionId,stockModify).toDTO();
    }

    public OptionDTO optionSpecify(Long productId, String color, String size)
    {
        return productDAO.optionSpecify(productId,color,size).toDTO();
    }

}
