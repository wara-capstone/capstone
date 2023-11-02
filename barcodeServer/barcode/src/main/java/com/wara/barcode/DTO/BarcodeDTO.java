package com.wara.barcode.DTO;


//import com.wara.barcode.entity.BarcodeEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BarcodeDTO {

    String barcodeNumber;
    String image;

}
