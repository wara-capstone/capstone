package wara.product.DTO;

import lombok.*;
import reactor.util.annotation.Nullable;
import wara.product.productEntity.OptionEntity;
import wara.product.productEntity.ProductEntity;
import wara.product.productEntity.UrlEntity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


@ToString
@Setter @Getter
@AllArgsConstructor @NoArgsConstructor
public class ProductDTO {

    Long productId;
    Long storeId;
    String productName;
    String productCategory;
    @Nullable
    List<UrlDTO> productUrls;
    @Nullable
    List<OptionDTO> options;

    public ProductDTO(ProductEntity productEntity, OptionEntity optionEntity) {
        this.productId = productEntity.getProductId();
        this.storeId = productEntity.getStoreId();
        this.productName = productEntity.getName();
        this.productCategory = productEntity.getCategory();
        this.productUrls = productEntity.urlEntitiesToDtos(productEntity.getImageUrls());
        this.options = new ArrayList<>();
        options.add(optionEntity.toDTO());
    }


    public ProductEntity toEntity()
    {
        return new ProductEntity(
                this.productId,
                this.storeId,
                this.productName,
                this.productCategory,
//                urlDtoToEntities(this.productUrls),
                Collections.emptyList(),
                Collections.emptyList()
                );
    }

    public ProductDTO(ProductEntity productEntity, List<OptionEntity> optionEntityList) {

            this.productId = productEntity.getProductId();
            this.storeId = productEntity.getStoreId();
            this.productName = productEntity.getName();
            this.productCategory = productEntity.getCategory();
            this.productUrls = productEntity.urlEntitiesToDtos(productEntity.getImageUrls());
            this.options = convert(optionEntityList);

    }


    //TODO: 아래 매서드 Opotion Entity로 옮길것
    public List<OptionDTO> convert(List<OptionEntity> options)
    {
        List<OptionDTO> list = new ArrayList<>();

        for(var item:options){
            list.add(item.toDTO());
        }
        return list;
    }

    public List<UrlEntity> urlDtoToEntities(List<UrlDTO> dtos)
    {
        List<UrlEntity> list = new ArrayList<>();

        for(UrlDTO dto : dtos)
        {
            list.add(dto.toEntity());
        }

        return list;
    }


}
