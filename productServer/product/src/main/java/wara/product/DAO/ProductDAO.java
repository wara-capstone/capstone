package wara.product.DAO;

import wara.product.productEntity.OptionEntity;
import wara.product.productEntity.ProductEntity;

import java.util.List;


public interface ProductDAO {

    ProductEntity readOneProduct(Long productId);
    List<ProductEntity> readManyProduct(Long productId);
    Long initProduct(ProductEntity productEntity);
    String modifyProduct(ProductEntity productEntity);
    String removeOneProduct(Long productId);
    String removeManyProduct(Long storeId);
    List<OptionEntity> readOptions(ProductEntity productEntity);
    OptionEntity readTargetoption(Long optionId);



    OptionEntity getOptionIdAfterSave(Long productId, OptionEntity optionEntity);
    String addOption(Long productId, OptionEntity optionEntity);
    String modifyOption(Long productId, OptionEntity optionEntity);
    String removeOption(Long optionId);


    List<ProductEntity> categoryFilter(String category);
    List<ProductEntity> storeCategoryFilter(Long storeId, String category);
    String stockModify(Long optionId, String stockModify);

    Long optionSpecify(Long productId, String color, String size);
}


