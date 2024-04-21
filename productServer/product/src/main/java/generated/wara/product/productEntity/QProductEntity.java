package wara.product.productEntity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QProductEntity is a Querydsl query type for ProductEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QProductEntity extends EntityPathBase<ProductEntity> {

    private static final long serialVersionUID = -106461982L;

    public static final QProductEntity productEntity = new QProductEntity("productEntity");

    public final StringPath category = createString("category");

    public final ListPath<UrlEntity, QUrlEntity> imageUrls = this.<UrlEntity, QUrlEntity>createList("imageUrls", UrlEntity.class, QUrlEntity.class, PathInits.DIRECT2);

    public final StringPath name = createString("name");

    public final ListPath<OptionEntity, QOptionEntity> options = this.<OptionEntity, QOptionEntity>createList("options", OptionEntity.class, QOptionEntity.class, PathInits.DIRECT2);

    public final NumberPath<Long> productId = createNumber("productId", Long.class);

    public final NumberPath<Long> storeId = createNumber("storeId", Long.class);

    public QProductEntity(String variable) {
        super(ProductEntity.class, forVariable(variable));
    }

    public QProductEntity(Path<? extends ProductEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QProductEntity(PathMetadata metadata) {
        super(ProductEntity.class, metadata);
    }

}

