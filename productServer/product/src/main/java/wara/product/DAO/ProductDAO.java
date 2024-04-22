package wara.product.DAO;

import com.querydsl.core.Tuple;
import wara.product.DTO.SortDTO;
import wara.product.productEntity.OptionEntity;
import wara.product.productEntity.ProductEntity;

import org.springframework.data.domain.Pageable;
import java.util.List;


public interface ProductDAO {

    ProductEntity readOneProduct(Long productId);
    List<ProductEntity> readManyProduct(Long productId);
    Long initProduct(ProductEntity productEntity);
    ProductEntity modifyProduct(ProductEntity productEntity);
    String removeOneProduct(Long productId);
    String removeManyProduct(Long storeId);
    List<OptionEntity> readOptions(ProductEntity productEntity);
    OptionEntity readTargetoption(Long optionId);



    OptionEntity getOptionIdAfterSave(Long productId, OptionEntity optionEntity);
    Long addOption(Long productId, OptionEntity optionEntity);
    String modifyOption(OptionEntity optionEntity);
    String removeOption(Long optionId);
    OptionEntity getOption(Long optionId);


    OptionEntity stockModify(Long optionId, String stockModify);
    OptionEntity optionSpecify(Long productId, String color, String size);



    // 검색, 정렬
    List<ProductEntity> categoryFilter(String category);
    List<ProductEntity> storeCategoryFilter(Long storeId, String category);

    List<SortDTO> sortTest(String condition, String type, String keyword, Pageable pageable);

}


