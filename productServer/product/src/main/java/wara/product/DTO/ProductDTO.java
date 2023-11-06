package wara.product.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;
import reactor.util.annotation.Nullable;
import wara.product.productEntity.ProductEntity;

import java.util.List;


@Setter @Getter
@AllArgsConstructor@NoArgsConstructor
public class ProductDTO {

    Long productId;
    Long storeId;
    String productName;
    String productPrice;
    String productSize;
    String productColor;
    String productStock;
    String productCategory;
    @Nullable
    String productUrls;


    /**
     * DTO를 Entity로 변환
     * */
    public ProductEntity DTOE()
    {
        return new ProductEntity(
                this.productId,
                this.storeId,
                this.productName,
                this.productPrice,
                this.productSize,
                this.productColor,
                this.productStock,
                this.productCategory,
                this.productUrls
        );
    }


    public ProductDTO(DummyDTO dto, @Nullable String url)
    {
        this.productId =dto.getProductId();
        this.storeId = dto.getStoreId();
        this.productName = dto.getProductName();
        this.productPrice = dto.getProductPrice();
        this.productSize = dto.getProductSize();
        this.productColor = dto.getProductColor();
        this.productStock = dto.getProductStock();
        this.productCategory = dto.getProductCategory();
        this.productUrls = url;
    }



}
