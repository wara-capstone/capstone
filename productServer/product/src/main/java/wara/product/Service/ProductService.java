package wara.product.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wara.product.DAO.ProductDAO;
import wara.product.DTO.OptionDTO;
import wara.product.DTO.ProductDTO;
import wara.product.productEntity.OptionEntity;
import wara.product.productEntity.ProductEntity;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;


@Service
public class ProductService {

    private final ProductDAO dao;

    public ProductService(@Autowired ProductDAO dao) {
        this.dao = dao;
    }


    /**
     * 단일값 요청에 대한 비즈니스 로직
     */
    public ProductDTO readOne(Long productId){
        ProductEntity productEntity = dao.readOneProduct(productId);
        List<OptionEntity> optionEntityList =  dao.readOptions(productEntity);

        return new ProductDTO(productEntity, optionEntityList);
    }

    public ProductDTO readTarget(Long productId, Long optionId)
    {
        ProductEntity productEntity =  dao.readOneProduct(productId);
        OptionEntity optionEntity = dao.readTargetoption(optionId);
        return new ProductDTO(productEntity,optionEntity);
    }


    /**
     * 한 상점의 모든 상품 정보 조회
     *
     * @return
     */
    //TODO: 매개변수 수정 (카테고리, 상점아이디)
    public List<ProductDTO> readMany(Long storeId)
    {

        List<ProductEntity> productEntities = dao.readManyProduct(storeId);
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
        return dao.initProduct(dto.toEntity());
    }


    public String modifyProduct(ProductDTO productDTO)
    {// 상품이 존재하는지 확인 할 것
        return dao.modifyProduct(productDTO.toEntity());
    }

    public String removeOneProduct(Long productId)
    {
        return dao.removeOneProduct(productId);
    }


    public String removeManyproduct(Long storeId)
    {
        return dao.removeManyProduct(storeId);
    }




    public String addOption(Long productId, OptionDTO optionDTO)
    {
        return dao.addOption(productId,optionDTO.toEntity());
    }


    public String modifyOption(Long productId, OptionDTO optionDTO)
    {
        return dao.modifyOption(productId,optionDTO.toEntity());
    }


    @Transactional
    public String removeoption(Long optionId)
    {
        return dao.removeOption(optionId);
    }






}
