package com.wara.barcode.Controller;

import com.google.zxing.WriterException;
import com.wara.barcode.DTO.BarcodeDTO;
import com.wara.barcode.Service.BarcodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@RestController
public class BarcodeController {
    private final BarcodeService barcodeService;
    public BarcodeController(@Autowired BarcodeService barcodeService) {
        this.barcodeService = barcodeService;
    }


    // 점주 pos에서 바코드 생성 요청
    @GetMapping("/barcode-create")
    public ResponseEntity<byte[]> getBarcode(@RequestBody BarcodeDTO dto) throws IOException, WriterException {
        return barcodeService.createBarcode(dto);
    }


    //유저의 바코드 정보 조회 요청
    @GetMapping("barcode-check")
    public void barcodeInfo(@RequestParam String productId)
    {
        // 서버간 통신 필요
        // 상품정보, 사진 등 필요함
    }

    @DeleteMapping("/delete")
    public void deleteBarcode(@RequestParam String productId)
    {
        // 서버간 통신 필요
    }


}
