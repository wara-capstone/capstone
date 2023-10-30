package com.wara.merchandise.dto;


import com.wara.merchandise.entity.MerchandiseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MerchandiseDTO {

    String itemName;
    String price;
    String size;
    String color;
    String stock;
    String category;
    String promotion;


    public MerchandiseEntity dtoToEntity()
    {
        return new MerchandiseEntity(
                "",
                this.itemName,
                this.price,
                this.size,
                this.color,
                this.stock,
                this.category,
                this.promotion);
    }
}
