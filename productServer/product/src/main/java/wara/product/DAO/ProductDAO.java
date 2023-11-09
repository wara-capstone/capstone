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





    String addOption(Long productId, OptionEntity optionEntity);
    String modifyOption(Long productId, OptionEntity optionEntity);
    String removeOption(Long optionId);


}

