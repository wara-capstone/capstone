package wara.product.DAO;

import org.springframework.beans.factory.annotation.Autowired;
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
    public ProductEntity readSingleData(ProductEntity entity) {
        return repository.getByProductId(entity.getProductId());
    }


    /**
     * 카테고리 기준 다중 값 반환
     * */
    @Override
    public List<ProductEntity> readMultiData(ProductEntity entity) {
        return repository.getAllByProductId(entity.getProductCategory());
    }








}
