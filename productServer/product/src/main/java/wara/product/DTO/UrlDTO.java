package wara.product.DTO;


import lombok.*;
import wara.product.productEntity.ProductEntity;
import wara.product.productEntity.UrlEntity;

import java.util.List;

@Getter @Setter @ToString
@AllArgsConstructor @NoArgsConstructor
public class UrlDTO {

    private Long id;
    private String url;

    public UrlDTO(String url)
    {
        this.url = url;
    }

    public UrlEntity toEntity()
    {
        return new UrlEntity(
                new ProductEntity(),
                this.url
        );
    }
}
