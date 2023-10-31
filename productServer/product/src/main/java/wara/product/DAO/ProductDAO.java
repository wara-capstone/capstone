package wara.product.DAO;

import org.springframework.stereotype.Repository;
import wara.product.productEntity.ProductEntity;

import java.util.List;

@Repository
public interface ProductDAO {

    public ProductEntity readSingleData(ProductEntity entity);
    public List<ProductEntity> readMultiData(ProductEntity entity);
}
