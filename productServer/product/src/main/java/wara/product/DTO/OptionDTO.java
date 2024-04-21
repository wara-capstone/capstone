package wara.product.DTO;

import lombok.*;
import wara.product.productEntity.OptionEntity;
import wara.product.productEntity.ProductEntity;

import javax.validation.constraints.Null;

@Getter@Setter
@AllArgsConstructor@NoArgsConstructor
@ToString
public class OptionDTO {


    Long optionId;
    Long productPrice;
    String productSize;
    String productColor;
    Long productStock;
    String barcodeUrl;


    public OptionEntity toEntity(){
        return new OptionEntity(

                  this.optionId ,
                new ProductEntity(),
                  this.productPrice,
                  this.productSize,
                  this.productColor,
                  this.productStock,
                  this.barcodeUrl
        );
    }
}
