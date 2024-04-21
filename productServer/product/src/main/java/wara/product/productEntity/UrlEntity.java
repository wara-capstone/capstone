package wara.product.productEntity;


import lombok.*;
import org.hibernate.annotations.Fetch;
import wara.product.DTO.UrlDTO;

import javax.persistence.*;

@Entity
@Getter @Setter @NoArgsConstructor @ToString
public class UrlEntity {



    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productId")
    private ProductEntity productEntity;

    @Column(name = "IMAGE_URL")
    private String url;



    public UrlEntity(ProductEntity productEntity, String url){
        this.productEntity = productEntity;
        this.url = url;
    }

    public UrlDTO toDto()
    {
        return new UrlDTO(
                this.id,
                this.url
        );
    }

}
