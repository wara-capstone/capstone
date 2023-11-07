package wara.product.DTO;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.util.annotation.Nullable;
import wara.product.productEntity.ProductEntity;

import java.util.List;


@ToString
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
    String productUrl;
    String barcodeUrl;


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
                this.productUrl,
                this.barcodeUrl
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
        this.productUrl = url;
    }


    public ProductDTO(DummyDTO dto, @Nullable String imageUrl, @Nullable String barcodeUrl)
    {
        this.productId =dto.getProductId();
        this.storeId = dto.getStoreId();
        this.productName = dto.getProductName();
        this.productPrice = dto.getProductPrice();
        this.productSize = dto.getProductSize();
        this.productColor = dto.getProductColor();
        this.productStock = dto.getProductStock();
        this.productCategory = dto.getProductCategory();
        this.productUrl = imageUrl;
        this.barcodeUrl = barcodeUrl;
    }


}
