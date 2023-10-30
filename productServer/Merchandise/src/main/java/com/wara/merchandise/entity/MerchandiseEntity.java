package com.wara.merchandise.entity;


import com.wara.merchandise.dto.MerchandiseDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Getter
@NoArgsConstructor
public class MerchandiseEntity {

    @Id @GeneratedValue
    String itemId;

    @Column
    String itemName;

    @Column
    String price;

    @Column
    String size;

    @Column
    String color;

    @Column
    String stock;

    @Column
    String category;

    @Column
    String promotion;

    public MerchandiseEntity(String itemID, String itemName, String price, String size,
                             String color, String stock, String category, String promotion){

        this.itemName = itemName;
        this.price = price;
        this.size = size;
        this.color = color;
        this.stock = stock;
        this.category = category;
        this.promotion = promotion;
    }

    public MerchandiseDTO entityToDto()
    {
        return new MerchandiseDTO(
                this.itemName,
                this.price,
                this.size,
                this.color,
                this.stock,
                this.category,
                this.promotion );
    }
}
