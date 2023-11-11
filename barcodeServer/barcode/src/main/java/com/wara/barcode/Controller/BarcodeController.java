package com.wara.barcode.Controller;

import com.google.zxing.WriterException;
import com.wara.barcode.DTO.BarcodeDTO;
import com.wara.barcode.Service.BarcodeService;
import com.wara.barcode.Service.TranslationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;


@RestController
@RequestMapping("/barcode")
public class BarcodeController {
    private final static Logger logger = LoggerFactory.getLogger(BarcodeController.class);
    private final BarcodeService barcodeService;
    private final TranslationService translationService;


    public BarcodeController(BarcodeService barcodeService, @Autowired TranslationService translationService) {
        this.barcodeService = barcodeService;
        this.translationService = translationService;
    }

    // 점주 pos에서 바코드 생성 요청
    @PostMapping()
    public String getBarcode(@RequestBody BarcodeDTO dto) throws IOException, WriterException, URISyntaxException {
        String returnvalue = translationService.uploadImage(barcodeService.createBarcode(dto));
        logger.info(returnvalue);
        return returnvalue;
    }


    //유저의 바코드 정보 조회 요청
    @GetMapping("/check")
    public HashMap barcodeInfo(@RequestParam Long productId) throws URISyntaxException, IOException {
        return translationService.toProduct(productId);
    }

    @DeleteMapping("/delete")
    public void deleteBarcode(@RequestParam String productId)
    {
        // 서버간 통신 필요
    }


}
