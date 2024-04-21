package wara.product.Repository;

import com.querydsl.core.Tuple;
import wara.product.DTO.SortDTO;
import wara.product.productEntity.ProductEntity;

import java.util.List;

public interface ProductCustomRepository {

    List<SortDTO> sortTest(String condition, String type , String keyword);
}
