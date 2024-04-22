package wara.product.Repository;

import com.querydsl.core.Tuple;
import wara.product.DTO.SortDTO;
import wara.product.productEntity.ProductEntity;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductCustomRepository {

    List<SortDTO> sortTest(String condition, String type , String keyword, Pageable pageable);
}
