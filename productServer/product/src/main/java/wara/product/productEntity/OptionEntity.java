package wara.product.productEntity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import reactor.util.annotation.Nullable;
import wara.product.DTO.OptionDTO;

import javax.persistence.*;


@Entity @Getter
@AllArgsConstructor @NoArgsConstructor
@ToString
public class OptionEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "option_id")
    private Long optionId;

    @ManyToOne
    @JoinColumn(name = "product_entity_product_id")
    private ProductEntity product;

    @Column(name = "price")
    private String productPrice;

    @Column(name = "size")
    private String productSize;

    @Column(name = "color")
    private String productColor;

    @Column(name = "stock")
    private String productStock;

    @Column(name = "barcode_url")
    private String barcodeUrl;




    public void setProduct(ProductEntity product){
        this.product = product;
    }


    public OptionDTO toDTO()
    {
        return new OptionDTO(
                this.optionId,
                this.productPrice,
                this.productSize,
                this.productColor,
                this.productStock,
                this.barcodeUrl
        );
    }

    public OptionEntity(OptionEntity optionEntity, String url)
    {
        this.optionId = optionEntity.getOptionId();
        this.productPrice = optionEntity.getProductPrice();
        this.productSize = optionEntity.getProductSize();
        this.productColor = optionEntity.getProductColor();
        this.productStock = optionEntity.getProductStock();
        this.barcodeUrl = url;
    }
}
