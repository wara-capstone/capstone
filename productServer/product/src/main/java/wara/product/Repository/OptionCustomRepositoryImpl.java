package wara.product.Repository;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import wara.product.DTO.OptionDTO;
import wara.product.productEntity.OptionEntity;
import wara.product.productEntity.ProductEntity;
import wara.product.productEntity.QOptionEntity;
import wara.product.productEntity.QProductEntity;

import java.util.List;
import java.util.Objects;

import static com.querydsl.core.types.Order.ASC;
import static wara.product.productEntity.QOptionEntity.optionEntity;
import static wara.product.productEntity.QProductEntity.productEntity;

@RequiredArgsConstructor
public class OptionCustomRepositoryImpl implements OptionCustomRepository{

    private final JPAQueryFactory jpaQueryFactory;


}
