package wara.product.productEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import wara.product.DTO.ProductDTO;

import javax.persistence.*;

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
                  this.productCategory
        );
    }

}
