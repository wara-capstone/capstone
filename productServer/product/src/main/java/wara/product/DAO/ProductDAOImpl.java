package wara.product.DAO;

import com.querydsl.core.Tuple;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import wara.product.DTO.SortDTO;
import wara.product.Repository.OptionRepository;
import wara.product.productEntity.OptionEntity;
import wara.product.productEntity.ProductEntity;
import wara.product.Repository.ProductRepository;

import org.springframework.data.domain.Pageable;
import java.util.List;


@Repository
public class ProductDAOImpl implements ProductDAO{

    private final ProductRepository productRepository;
    private final OptionRepository optionRepository;

    private static final Logger logger = LoggerFactory.getLogger(ProductDAOImpl.class);

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
        logger.info("전달받은 엔티티" + productEntity.toString());
        ProductEntity product = productRepository.save(productEntity);
        return product.getProductId();
    }


    /**
     * @param productEntity
     */
    @Override
    public ProductEntity modifyProduct(ProductEntity productEntity) {
        if(productRepository.existsByProductId(productEntity.getProductId())) {


            return productRepository.save(productEntity);
        }
        else return productRepository.save(productEntity);
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
    public Long addOption(Long productId, OptionEntity optionEntity) {
        optionEntity.setProduct(productRepository.getByProductId(productId));
        OptionEntity latest = optionRepository.save(optionEntity);

        return latest.getOptionId();
    }

    @Override
    public OptionEntity getOptionIdAfterSave(Long productId, OptionEntity optionEntity) {
        logger.info("PID: " + productId);
        logger.info("option entity: " + optionEntity.toString());
        optionEntity.setProduct(productRepository.getByProductId(productId));
        return optionRepository.save(optionEntity);
    }


    @Override
    public String modifyOption(OptionEntity optionEntity) {
        optionRepository.save(optionEntity);
        logger.info("수정 후" + optionEntity);


        logger.info("DB저장 값 체크 option기준" + optionRepository.getByOptionId(optionEntity.getOptionId()));
        logger.info("DB저장 값 체크 product기준" + productRepository.getByProductId(optionEntity.getProduct().getProductId()));
        return HttpStatus.OK.toString();
    }

    @Override
    public String removeOption(Long optionId) {
        optionRepository.deleteByOptionId(optionId);
        return HttpStatus.OK.toString();
    }

    @Override
    public OptionEntity getOption(Long optionId) {
        return optionRepository.getByOptionId(optionId);
    }

    @Override
    public List<ProductEntity> categoryFilter(String category) {
        return productRepository.getAllByCategory(category);
    }

    @Override
    public List<ProductEntity> storeCategoryFilter(Long storeId, String category) {
//        return productRepository.getAllByStoreIdAndProductCategory(storeId, category);
        return productRepository.findByStoreIdAndCategory(storeId, category);
    }


    @Override
    public OptionEntity stockModify(Long optionId, String stockModify)
    {
        OptionEntity oldEntity =  optionRepository.findByOptionId(optionId);
        oldEntity.stockModify(stockModify);
        return optionRepository.save(oldEntity);
    }

    @Override
    public OptionEntity optionSpecify(Long productId, String color, String size) {
        ProductEntity product = productRepository.getByProductId(productId);
        return optionRepository.getByProductAndColorAndSize(product,color,size);

    }


    @Override
    public List<SortDTO> sortTest(String condition, String type, String keyword, Pageable pageable) {
        return productRepository.sortTest(condition, type, keyword, pageable);
    }
}
