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

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public void setProductPrice(String productPrice) {
        this.productPrice = productPrice;
    }

    public void setProductSize(String productSize) {
        this.productSize = productSize;
    }

    public void setProductColor(String productColor) {
        this.productColor = productColor;
    }

    public void setProductStock(String productStock) {
        this.productStock = productStock;
    }

    public void setBarcodeUrl(String barcodeUrl) {
        this.barcodeUrl = barcodeUrl;
    }

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

    /**
     * @param optionEntity  id포함 모든 속성 값
     * @param url url만 사용
     */
    public OptionEntity(OptionEntity optionEntity, String url)
    {
        this.optionId = optionEntity.getOptionId();
        this.productPrice = optionEntity.getProductPrice();
        this.productSize = optionEntity.getProductSize();
        this.productColor = optionEntity.getProductColor();
        this.productStock = optionEntity.getProductStock();
        this.barcodeUrl = url;
    }

    public OptionEntity(OptionEntity old, OptionEntity modify)
    {
        this.optionId = old.getOptionId();
        this.productPrice = modify.getProductPrice();
        this.productSize = modify.getProductSize();
        this.productColor = modify.getProductColor();
        this.productStock = modify.getProductStock();
        this.barcodeUrl = old.getBarcodeUrl();
    }

    public void stockModify(String stockModify)
    {
        int a = Integer.parseInt(this.productStock);
        int b = Integer.parseInt(stockModify);
        this.productStock = String.valueOf(a + b);
    }




}
