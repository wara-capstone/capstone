package wara.product.productEntity;


import lombok.*;
import wara.product.DTO.OptionDTO;
import wara.product.DTO.ProductDTO;
import wara.product.DTO.UrlDTO;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Entity @Table(name = "PRODUCTS")
@SequenceGenerator(
        name = "PRODUCT_SEQ_GENERATOR",
        sequenceName = "PRODUCT_SEQ" //alloc-size default 50
)
@AllArgsConstructor @NoArgsConstructor
@Getter @Setter @ToString @Builder
public class ProductEntity {

    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE ,
                        generator = "PRODUCT_SEQ_GENERATOR")
    @Column(name = "PRODUCT_ID")
    Long productId;

    @Column(name = "STORE_ID")
    Long storeId;

    @Column(name= "NAME")
    String name;

    @Column(name = "CATEGORY")
    String category;


    @ToString.Exclude @Column(name ="IMAGE_URLS")
    @OneToMany(cascade = CascadeType.ALL,
                fetch = FetchType.LAZY,
                mappedBy = "productEntity")
    List<UrlEntity> imageUrls;

    @ToString.Exclude  @Column(name = "OPTIONS")
    @OneToMany(cascade = CascadeType.ALL,
                fetch = FetchType.LAZY,
                mappedBy = "product")
    List<OptionEntity> options;





    public List<String> urlToDto(List<UrlEntity> urls)
    {
        List<String> strings = new ArrayList<>();
        for(UrlEntity url:urls)
        {
            strings.add(url.toString());
        }
        return strings;
    }


    public ProductDTO toDTO(){
        if(options.isEmpty()){
            return new ProductDTO(
                    this.productId,
                    this.storeId,
                    this.name,
                    this.category,
                    urlEntitiesToDtos(this.imageUrls), // null pointer 처리안했음
                    Collections.emptyList()
            );
        }
        else
            return new ProductDTO(
                    this.productId,
                    this.storeId,
                    this.name,
                    this.category,
                    urlEntitiesToDtos(this.imageUrls),
                    optionEntitiesToDtos(this.options)
            );
    }


    public List<OptionDTO> optionEntitiesToDtos(List<OptionEntity> options)
    {
        List<OptionDTO> list = new ArrayList<>();

        for(var item:options){
            list.add(item.toDTO());
        }
        return list;
    }

    public List<UrlDTO> urlEntitiesToDtos(List<UrlEntity> urls)
    {
        List<UrlDTO> list = new ArrayList<>();
        for(UrlEntity item:urls)
        {
            list.add(item.toDto());
        }
        return list;
    }

    public static List<ProductDTO> toFlatDTOs(List<ProductEntity> entities){
        List<ProductDTO> productDTOS = new ArrayList<>();
        for(ProductEntity product : entities){
            for(OptionEntity option: product.getOptions() ){
                productDTOS.add(
                        ProductEntity.builder()
                        .category(product.getCategory())
                        .productId(product.getProductId())
                        .storeId(product.getStoreId())
                        .imageUrls(product.getImageUrls())
                        .name(product.getName())
                        .options(Arrays.asList(option))
                        .build().toDTO());
            }
        }
        return productDTOS;
    }

}
