package wara.product.DAO;

import wara.product.productEntity.ProductEntity;

import java.util.List;


public interface ProductDAO {

    ProductEntity readSingleProductInfo(Long productId);
    List<ProductEntity> readMultiProductInfo(Long productId);

    void removeSingleProduct(Long productId);
    void removeMultiProduct(Long storeId);
    void modifyProductInfo(ProductEntity entity);
    void initProductInfo(ProductEntity entity);
}
