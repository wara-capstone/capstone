package com.wara.barcode.entity;
import com.wara.barcode.dto.BarcodeDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Getter
@NoArgsConstructor
public class BarcodeEntity {

    @Id
    String id;


    public BarcodeEntity(String id) {
        this.id = id;
    }

    public BarcodeDTO dtoToEntity(){
        BarcodeDTO dto = new BarcodeDTO();

        dto.setBarcodeNumber(this.id);

        return dto;
    }
}
