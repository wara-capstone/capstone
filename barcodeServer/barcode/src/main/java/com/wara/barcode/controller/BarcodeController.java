package com.wara.barcode.controller;


import com.google.zxing.WriterException;
import com.wara.barcode.dto.BarcodeDTO;
//import com.wara.barcode.entity.BarcodeEntity;
import com.wara.barcode.service.BarcodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@RestController
public class BarcodeController {

    private BarcodeDTO barcodeDTO;
    private BarcodeService barcodeService;
    public BarcodeController(@Autowired BarcodeDTO barcodeDTO,
                             @Autowired BarcodeService barcodeService) {
        this.barcodeDTO = barcodeDTO;
        this.barcodeService = barcodeService;
    }




    // 점주 pos에서 바코드 생성 요청
    @GetMapping("/barcode-create")
    public ResponseEntity<byte[]> getBarcode(@RequestParam String id) throws IOException, WriterException {
        return barcodeService.createBarcode(id);
    }


    //유저의 바코드 정보 조회 요청
    @GetMapping("barcode-info")
    public void barcodeInfo(@RequestParam String info)
    {

    }


//    @PostMapping("/post")
//    public void updateBarcode(@RequestParam String mpdify) {}

//    @PutMapping("/put")
//    public void createBarcode(@RequestParam String barcodeInfo) {}

    @DeleteMapping("/delete")
    public void deleteBarcode(@RequestParam String id) {}











}
