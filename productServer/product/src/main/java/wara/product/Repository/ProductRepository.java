package wara.product.Repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import wara.product.productEntity.ProductEntity;
import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity,String>, ProductCustomRepository{

    ProductEntity getByProductId(Long id);
    List<ProductEntity> getAllByStoreId(Long id);

    Boolean existsByStoreId(Long storeId);
    Boolean existsByProductId(Long productId);
    void deleteByProductId(Long id);
    void deleteAllByStoreId(Long id);
    List<ProductEntity> getAllByCategory(String category);


    // 검색, 정렬
    List<ProductEntity> getAllByStoreIdAndCategory(Long storeId, String category);
    List<ProductEntity> findByStoreIdAndCategory(Long storeId, String productCategory);
    List<ProductEntity> getByNameContaining(String keyword);

    
    //아래 메서드 기준값 정할 것 메모장 참고
    //쿼리 작성
    //검색어 + 옵션 가격 높은 순 낮은 순

    // pid 기준 조인
    // 페이징
    // 리스트<옵션> 반환
//    @Query(value = "select " +
//            "new wara.product.DTO.ProductDTO()" + //매개변수 넣을것
//            "from ProductEntity p " +
//            "where p.name like %:keyword% and p.category = :category " +
//            "order by p.name desc") // service layer에서 offset과 limit을 제공해야함
//    List<ProductEntity> getByNameContainingIgnoreCaseAndNameOrderByNameDesc(@Param("keyword") String keyword,
//                                                                            @Param("category") String category,
//                                                                            Pageable pageable);
//
//    // keyword 검색
//    @Query(value = "select " +
//            "new wara.product.DTO.ProductDTO()" + //매개변수 넣을것
//            "from ProductEntity p " +
//            "where p.name like %:keyword% "+
//            "order by p.name desc") // service layer에서 offset과 limit을 제공해야함
//    List<ProductEntity> getByKeyword(@Param("keyword") String keyword,
//                                     Pageable pageable);

    // keyword & category(asc/desc)
    // keyword & price(asc/desc)

}


