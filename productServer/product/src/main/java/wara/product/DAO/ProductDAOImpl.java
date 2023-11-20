package wara.product.DAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import wara.product.Repository.OptionRepository;
import wara.product.productEntity.OptionEntity;
import wara.product.productEntity.ProductEntity;
import wara.product.Repository.ProductRepository;

import java.util.List;


@Repository
public class ProductDAOImpl implements ProductDAO{

    private final ProductRepository productRepository;
    private final OptionRepository optionRepository;

    public ProductDAOImpl(@Autowired ProductRepository productRepository,
                          @Autowired OptionRepository optionRepository) {
        this.productRepository = productRepository;
        this.optionRepository = optionRepository;
    }

    //TODO: getBy, findBy 구분해서 사용


    /**
     * 상품 ID기준 단일 값 반환
     * */
    @Override
    public ProductEntity readOneProduct(Long productId) {
        return productRepository.getByProductId(productId);
    }

    @Override
    public List<OptionEntity> readOptions(ProductEntity productEntity)
    {
        return optionRepository.findAllByProduct(productEntity);
    }

    @Override
    public OptionEntity readTargetoption(Long optionId)
    {
        return optionRepository.findByOptionId(optionId);
    }



    /**
     * 상점 ID값 기준 다중 값 반환
     * */
    public List<ProductEntity> readManyProduct(Long storeId) {
        return productRepository.getAllByStoreId(storeId);
    }



    @Override
    public Long initProduct(ProductEntity productEntity) {
        ProductEntity product = productRepository.save(productEntity);
        return product.getProductId();
    }


    /**
     * @param productEntity
     */
    @Override
    public String modifyProduct(ProductEntity productEntity) {
        if(productRepository.existsByProductId(productEntity.getProductId())) {
            productRepository.save(productEntity);
            return HttpStatus.OK.toString();
        }
        else return HttpStatus.NO_CONTENT.toString();
    }

    /**
     * @param productId 단일 상품 삭제
     * @return
     */
    @Override
    public String removeOneProduct(Long productId) {
        productRepository.deleteByProductId(productId);
        return HttpStatus.OK.toString();
    }

    /**
     * @param storeId 한 상점의 상품 전체 삭제
     * @return
     */
    @Override
    public String removeManyProduct(Long storeId) {
        productRepository.deleteAllByStoreId(storeId);
        return HttpStatus.OK.toString();
    }


    @Override
    public String addOption(Long productId, OptionEntity optionEntity) {
        optionEntity.setProduct(productRepository.getByProductId(productId));
        optionRepository.save(optionEntity);
        return HttpStatus.CREATED.toString();
    }

    @Override
    public OptionEntity getOptionIdAfterSave(Long productId, OptionEntity optionEntity) {
        optionEntity.setProduct(productRepository.getByProductId(productId));
        return optionRepository.save(optionEntity);
    }


    @Override
    public String modifyOption(Long productId, OptionEntity optionEntity) {
        optionEntity.setProduct(productRepository.getByProductId(productId));
        optionRepository.save(optionEntity);
        return HttpStatus.OK.toString();
    }

    @Override
    public String removeOption(Long optionId) {
        optionRepository.deleteByOptionId(optionId);
        return HttpStatus.OK.toString();
    }

    @Override
    public List<ProductEntity> categoryFilter(String category) {
        return productRepository.getAllByProductCategory(category);
    }

    @Override
    public List<ProductEntity> storeCategoryFilter(Long storeId, String category) {
        return productRepository.getAllByStoreIdAndProductCategory(storeId, category);
    }


    @Override
    public String stockModify(Long optionId, String stockModify)
    {
        OptionEntity oldEntity =  optionRepository.findByOptionId(optionId);
        oldEntity.stockModify(stockModify);
        optionRepository.save(oldEntity);
        return HttpStatus.OK.toString();
    }

}
