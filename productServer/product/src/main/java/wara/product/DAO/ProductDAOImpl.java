package wara.product.DAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import wara.product.productEntity.ProductEntity;
import wara.product.Repository.ProductRepository;

import java.util.List;


@Repository
public class ProductDAOImpl implements ProductDAO{

    private final ProductRepository repository;

    public ProductDAOImpl(@Autowired ProductRepository repository) {
        this.repository = repository;
    }



    /**
     * 상품 ID기준 단일 값 반환
     * */
    @Override
    public ProductEntity readSingleProductInfo(Long productId) {
        return repository.getByProductId(productId);
    }

    /**
     * ID값 기준 다중 값 반환
     * */
    public List<ProductEntity> readMultiProductInfo(Long storeId) {
        return repository.getAllByStoreId(storeId);
    }


    /**
     * @param productId
     */
    @Override
    public void removeSingleProduct(Long productId) {
        repository.deleteByProductId(productId);
    }

    /**
     * @param storeId
     */
    @Override
    public void removeMultiProduct(Long storeId) {
        repository.deleteAllByStoreId(storeId);
    }

    /**
     * @param entity
     */
    @Override
    public HttpStatus modifyProductInfo(ProductEntity entity) {
        System.out.println(entity.toString());
        if(repository.existsByProductId(entity.getProductId())) {
            repository.save(entity);
            return HttpStatus.OK;
        }
        else return HttpStatus.NO_CONTENT;
    }

    /**
     * @param entity
     * @return
     */
    @Override
    public Long initProductInfo(ProductEntity entity) {
        repository.save(entity);
        return entity.getProductId();
    }


}
