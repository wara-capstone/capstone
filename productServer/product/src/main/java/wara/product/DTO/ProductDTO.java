package wara.product.DTO;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.util.annotation.Nullable;
import wara.product.productEntity.OptionEntity;
import wara.product.productEntity.ProductEntity;
import wara.product.productEntity.Urls;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


@ToString
@Setter @Getter
@AllArgsConstructor@NoArgsConstructor
public class ProductDTO {

    Long productId;
    Long storeId;
    String productName;
    String productCategory;
    @Nullable
    List<String> productUrls;
    @Nullable
    List<OptionDTO> options;

    public ProductDTO(ProductEntity productEntity, OptionEntity optionEntity) {
        this.productId = productEntity.getProductId();
        this.storeId = productEntity.getStoreId();
        this.productName = productEntity.getProductName();
        this.productCategory = productEntity.getProductCategory();
        this.productUrls = productEntity.getProductUrls().getUrls();
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
                new Urls(productUrls),
                Collections.emptyList()
                );

    }


    public ProductDTO(ProductDTO productDTO, List<OptionDTO> optionDTO) {
        try {
            this.productId = productDTO.getProductId();
            this.storeId = productDTO.getStoreId();
            this.productName = productDTO.getProductName();
            this.productCategory = productDTO.getProductCategory();
            this.productUrls = productDTO.getProductUrls();
            this.options = optionDTO;
        }catch (NullPointerException e){
            this.productId = productDTO.getProductId();
            this.storeId = productDTO.getStoreId();
            this.productName = productDTO.getProductName();
            this.productCategory = productDTO.getProductCategory();
            this.productUrls = productDTO.getProductUrls();
            Collections.emptyList();
        }
    }

    public ProductDTO(ProductEntity productEntity, List<OptionEntity> optionEntityList) {

            this.productId = productEntity.getProductId();
            this.storeId = productEntity.getStoreId();
            this.productName = productEntity.getProductName();
            this.productCategory = productEntity.getProductCategory();
            this.productUrls = productEntity.getProductUrls().getUrls();
            this.options = convert(optionEntityList);

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
