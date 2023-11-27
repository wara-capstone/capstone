package wara.product.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import wara.product.DTO.ProductDTO;
import wara.product.productEntity.ProductEntity;

import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity,String> {

    ProductEntity getByProductId(Long id);
    List<ProductEntity> getAllByStoreId(Long id);

    Boolean existsByStoreId(Long storeId);
    Boolean existsByProductId(Long productId);
    void deleteByProductId(Long id);
    void deleteAllByStoreId(Long id);
    List<ProductEntity> getAllByProductCategory(String category);
    List<ProductEntity> getAllByStoreIdAndProductCategory(Long storeId,String category);
    List<ProductEntity> findByStoreIdAndAndProductCategory(Long storeId, String productCategory);
}


