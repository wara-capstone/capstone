package wara.product.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import wara.product.productEntity.ProductEntity;

@Getter@Setter
@AllArgsConstructor@NoArgsConstructor
public class DummyDTO {

    Long productId;
    Long storeId;
    String productName;
    String productPrice;
    String productSize;
    String productColor;
    String productStock;
    String productCategory;


}
