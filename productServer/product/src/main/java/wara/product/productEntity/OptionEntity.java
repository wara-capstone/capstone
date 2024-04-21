package wara.product.productEntity;


import lombok.*;
import wara.product.DTO.OptionDTO;

import javax.persistence.*;


@Entity @Table(name = "OPTIONS")
@SequenceGenerator(
        name = "OPTION_SEQ_GENERATOR",
        sequenceName = "OPTION_SEQ"
)
@Getter @Setter @ ToString
@AllArgsConstructor @NoArgsConstructor
public class OptionEntity {

    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE,
                        generator = "OPTION_SEQ_GENERATOR")
    @Column(name = "OPTION_ID")
    private Long optionId;

    @ManyToOne(fetch = FetchType.LAZY) @ToString.Exclude
    @JoinColumn(name = "productId")
    private ProductEntity product;

    @Column(name = "PRICE")
    private Long price;

    @Column(name = "SIZE")
    private String size;

    @Column(name = "COLOR")
    private String color;

    @Column(name = "STOCK")
    private Long stock;

    @Column(name = "BARCODE_URL")
    private String barcodeUrl;



    public OptionDTO toDTO()
    {
        return new OptionDTO(
                this.optionId,
                this.price,
                this.size,
                this.color,
                this.stock,
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
        this.price = optionEntity.getPrice();
        this.size = optionEntity.getSize();
        this.color = optionEntity.getColor();
        this.stock = optionEntity.getStock();
        this.barcodeUrl = url;
    }

    @Builder
    public void modify(OptionEntity latest){

        this.setColor(latest.getColor());
        this.setPrice(latest.getPrice());
        this.setStock(latest.getStock());
        this.setColor(latest.getColor());
        this.setSize(latest.getSize());

    }


    public void stockModify(String stockModify)
    {
        Long a = this.stock;
        Long b = Long.parseLong(stockModify);
        this.stock = a + b;
    }

}
