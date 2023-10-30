package com.wara.barcode.dto;


//import com.wara.barcode.entity.BarcodeEntity;
import com.wara.barcode.entity.BarcodeEntity;
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
public class BarcodeDTO {

    String barcodeNumber;

}
