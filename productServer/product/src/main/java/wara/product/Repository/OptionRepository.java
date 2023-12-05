package wara.product.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wara.product.productEntity.OptionEntity;
import wara.product.productEntity.ProductEntity;

import java.util.List;

@Repository
public interface OptionRepository extends JpaRepository<OptionEntity, Long> {

    OptionEntity findByOptionId(Long optionId);
    void deleteByOptionId(Long optionId);
    OptionEntity findByProduct(ProductEntity product);
    List<OptionEntity> findAllByProduct(ProductEntity product);
    OptionEntity getByOptionId(Long optionId);

    OptionEntity getByProductAndProductColorAndProductSize(ProductEntity productEntity,String color, String size);
}
