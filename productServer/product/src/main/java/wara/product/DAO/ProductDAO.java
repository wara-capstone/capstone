package wara.product.DAO;

import org.springframework.http.HttpStatus;
import wara.product.productEntity.ProductEntity;

import java.util.List;


public interface ProductDAO {

    ProductEntity readSingleProductInfo(Long productId);
    List<ProductEntity> readMultiProductInfo(Long productId);

    void removeSingleProduct(Long productId);
    void removeMultiProduct(Long storeId);
    HttpStatus modifyProductInfo(ProductEntity entity);
    Long initProductInfo(ProductEntity entity);
}
