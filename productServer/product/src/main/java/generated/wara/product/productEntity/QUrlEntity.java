package wara.product.productEntity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUrlEntity is a Querydsl query type for UrlEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUrlEntity extends EntityPathBase<UrlEntity> {

    private static final long serialVersionUID = 1714042210L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUrlEntity urlEntity = new QUrlEntity("urlEntity");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QProductEntity productEntity;

    public final StringPath url = createString("url");

    public QUrlEntity(String variable) {
        this(UrlEntity.class, forVariable(variable), INITS);
    }

    public QUrlEntity(Path<? extends UrlEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUrlEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUrlEntity(PathMetadata metadata, PathInits inits) {
        this(UrlEntity.class, metadata, inits);
    }

    public QUrlEntity(Class<? extends UrlEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.productEntity = inits.isInitialized("productEntity") ? new QProductEntity(forProperty("productEntity")) : null;
    }

}

