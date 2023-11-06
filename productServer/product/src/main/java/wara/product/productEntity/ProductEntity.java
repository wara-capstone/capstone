package wara.product.productEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import reactor.util.annotation.Nullable;
import wara.product.DTO.ProductDTO;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor @NoArgsConstructor
@Getter
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

    @Column
    String productUrls;




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
                this.productUrls
        );
    }

}
