package wara.product.productEntity;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.util.annotation.Nullable;
import wara.product.DTO.ProductDTO;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor @NoArgsConstructor
@Getter
@ToString
public class ProductEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long productId;

    @Column
    Long storeId;

    @Column
    String productName;

    @Column
    String productPrice;

    @Column
    String productSize;

    @Column
    String productColor;

    @Column
    String productStock;

    @Column
    String productCategory;

    @Column@Nullable
    String productUrls;

    @Column@Nullable
    String barcodeUrl;



    public ProductDTO ETOD()
    {
        return new ProductDTO(
                this.productId,
                this.storeId,
                this.productName,
                this.productPrice,
                this.productSize,
                this.productColor,
                this.productStock,
                this.productCategory,
                this.productUrls,
                this.barcodeUrl
        );
    }

}
