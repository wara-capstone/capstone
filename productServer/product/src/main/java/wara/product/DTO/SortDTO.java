package wara.product.DTO;


import com.querydsl.core.Tuple;
import com.querydsl.core.annotations.QueryProjection;
import lombok.*;
import reactor.util.annotation.Nullable;
import wara.product.productEntity.QOptionEntity;
import wara.product.productEntity.QProductEntity;

import java.util.List;

import static wara.product.productEntity.QOptionEntity.optionEntity;
import static wara.product.productEntity.QProductEntity.productEntity;

@Getter @Setter @ToString @Builder
@NoArgsConstructor
public class SortDTO {

    //product property
    Long productId;
    Long storeId;
    String name;
    String category;
    List<String> imageUrl;

    //option property
    Long optionId;
    Long price;
    String size;
    String color;
    Long stock;
    String barcodeUrl;



    public SortDTO(Long productId, Long storeId, String name, String category, List<String> imageUrl,
                   Long optionId, Long price, String size, String color, Long stock, String barcodeUrl) {
        this.productId = productId;
        this.storeId = storeId;
        this.name = name;
        this.category = category;
        this.imageUrl = imageUrl;
        this.optionId = optionId;
        this.price = price;
        this.size = size;
        this.color = color;
        this.stock = stock;
        this.barcodeUrl = barcodeUrl;
    }


    // image urls가 없는 생성자
    public SortDTO(Long productId, Long storeId, String name, String category,
                   Long optionId, Long price, String size, String color, Long stock, String barcodeUrl) {
        this.productId = productId;
        this.storeId = storeId;
        this.name = name;
        this.category = category;
        this.optionId = optionId;
        this.price = price;
        this.size = size;
        this.color = color;
        this.stock = stock;
        this.barcodeUrl = barcodeUrl;
    }
}
