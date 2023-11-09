package wara.product.productEntity;

import lombok.*;
import reactor.util.annotation.Nullable;
import wara.product.DTO.OptionDTO;
import wara.product.DTO.ProductDTO;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity @Table(name = "products")
@AllArgsConstructor @NoArgsConstructor
@Getter @ToString
public class ProductEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    Long productId;

    @Column(name = "store_id")
    Long storeId;

    @Column(name = "category")
    String productCategory;

    @Embedded @Nullable
    Urls productUrls;

    @OneToMany(cascade = CascadeType.ALL) @JoinColumn(name = "product_entity_product_id", referencedColumnName = "product_id")
    List<OptionEntity> options;


    public ProductEntity(Long productId, Long storeId, String productCategory,
                         @Nullable List<String> productUrls, OptionEntity options) {
        this.productId = productId;
        this.storeId = storeId;
        this.productCategory = productCategory;
        this.productUrls = new Urls(productUrls);
        this.options.add(options);
    }


    public ProductEntity(ProductEntity r, OptionEntity o)
    {
        this.productId = r.getProductId();
        this.storeId = r.getStoreId();
        this.productCategory = r.getProductCategory();
        this.productUrls = r.getProductUrls();
        this.options = new ArrayList<>();
        this.options.add(o);
    }


    public ProductDTO toDTO(){
        try {
            return new ProductDTO(
                    this.productId,
                    this.storeId,
                    this.productCategory,
                    this.productUrls.getUrls(),
                    convert(this.options)
            );
        }catch (NullPointerException e){ // DB에 저장된 URL이 없는경우
            return new ProductDTO(
                    this.productId,
                    this.storeId,
                    this.productCategory,
                    Collections.emptyList(),
                    Collections.emptyList());
        }
    }

    public List<OptionDTO> convert(List<OptionEntity> options)
    {
        List<OptionDTO> list = new ArrayList<>();

        for(var item:options){
            list.add(item.toDTO());
        }
        return list;
    }

}
