package wara.product.Repository;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import wara.product.DTO.SortDTO;

import org.springframework.data.domain.Pageable;
import java.util.Collections;
import java.util.List;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

import static wara.product.productEntity.QOptionEntity.optionEntity;
import static wara.product.productEntity.QProductEntity.productEntity;
import static wara.product.productEntity.QUrlEntity.urlEntity;

@RequiredArgsConstructor
public class ProductCustomRepositoryImpl implements ProductCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;
    private static final Logger logger = LoggerFactory.getLogger(ProductCustomRepositoryImpl.class);


    @Override
    public List<SortDTO> sortTest(String condition, String type, String keyword, Pageable pageable) {
        List<SortDTO> sorted =
                jpaQueryFactory
                .select(
                        Projections.constructor(wara.product.DTO.SortDTO.class,
                                productEntity.productId,
                                productEntity.storeId,
                                productEntity.name,
                                productEntity.category,
                                optionEntity.optionId,
                                optionEntity.price,
                                optionEntity.size,
                                optionEntity.color,
                                optionEntity.stock,
                                optionEntity.barcodeUrl))
                .from(productEntity)
                .join(productEntity.options, optionEntity)
                .where(WhereStateEnum.of(condition).handle(keyword))
                .distinct()
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(OrderStateEnum.of(condition).handle(type, keyword))
                .fetch();

        logger.info(sorted.toString());

        // Extract all product IDs
        List<Long> productIds = sorted.stream()
                .map(SortDTO::getProductId)
                .distinct()
                .collect(Collectors.toList());


        // Fetch all image URLs corresponding to the product IDs in a single query
        Map<Long, List<String>> imageUrlMap = jpaQueryFactory
                .select(urlEntity.productEntity.productId, urlEntity.url)
                .from(urlEntity)
                .where(urlEntity.productEntity.productId.in(productIds))
                .fetch()
                .stream()
                // Extract the product ID as Long and URL as String from the Tuple
                .collect(Collectors.groupingBy(
                        result -> result.get(0, Long.class), // product ID
                        Collectors.mapping(
                                result -> result.get(1, String.class), // image URL 문자열만 추출
                                Collectors.toList())));


//        // Set the image URLs corresponding to each SortDTO object
//        sorted.forEach(dto -> dto.setImageUrl(imageUrlMap.getOrDefault(dto.getProductId(), Collections.emptyList())));
        for (SortDTO dto : sorted) {
            List<String> imageUrlList = imageUrlMap.getOrDefault(dto.getProductId(), Collections.emptyList());

            dto.setImageUrl(imageUrlList);
        }

        return sorted;
    }

    enum WhereStateEnum{
        PRICE {
            @Override
            BooleanExpression handle(String keyword) {
                return null;
            }
        }, KEYWORD {
            @Override
            BooleanExpression handle(String keyword) {
                return productEntity.name.like(keyword);
            }
        }, CATEGORY {
            @Override
            BooleanExpression handle(String keyword) {
                return productEntity.category.eq(keyword);
            }
        }, SEARCH {
            @Override
            BooleanExpression handle(String keyword) {
                return productEntity.name.like(keyword).or(productEntity.category.eq(keyword));
            }
        };


        public static WhereStateEnum of(String condition) {
            return Arrays.stream(values())
                    .filter(value -> value.name().equalsIgnoreCase(condition))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(condition));
        }

        abstract BooleanExpression handle(String keyword);
    }



    enum OrderStateEnum {
        PRICE {
            @Override
            OrderSpecifier[] handle(String type, String keyword) {
                logger.info("ORDER BY PRICE" + type);
                if(type.equals("ASC")) return new OrderSpecifier[]{optionEntity.price.asc()};
                else  return new OrderSpecifier[]{optionEntity.price.desc()};

            }
        }, KEYWORD {
            @Override
            OrderSpecifier[] handle(String type, String keyword) {
                logger.info("ORDER BY KEYWORD" + type);
                if(type.equals("ASC")) return new OrderSpecifier[]{productEntity.name.asc()};
                else return new OrderSpecifier[]{productEntity.name.desc()};
            }
        }, CATEGORY {
            @Override
            OrderSpecifier[] handle(String type, String keyword) {
                logger.info("ORDER BY CATEGORY" + type);
                if(type.equals("ASC")) return new OrderSpecifier[]{productEntity.name.asc()};
                else return new OrderSpecifier[]{productEntity.name.desc()};
            }
        }, SEARCH {
            @Override
            OrderSpecifier[] handle(String type, String keyword) {
                return new OrderSpecifier<?>[0];
            }
        };

        public static OrderStateEnum of(String condition) {
            return Arrays.stream(values())
                    .filter(value -> value.name().equalsIgnoreCase(condition))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(condition));
        }

        abstract OrderSpecifier[] handle(String type, String keyword);
    }


}



