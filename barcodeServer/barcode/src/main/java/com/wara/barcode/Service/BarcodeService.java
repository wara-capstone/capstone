package com.wara.barcode.Service;



import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import com.wara.barcode.DTO.BarcodeDTO;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import java.io.IOException;


@Service
public class BarcodeService {

    ObjectMapper objectMapper = new ObjectMapper();

    public ByteArrayMultipartFile createBarcode(BarcodeDTO dto) throws WriterException, IOException {
        // 바코드 사이즈
        int width = 800;
        int height = 200;

        // 바코드 이미지 생성
        try {
            // DTO를 String으로 변환
            String url = objectMapper.writeValueAsString(dto);
            BarcodeDTO barcode =  new BarcodeDTO(dto.getProductId(), dto.getOptionId());
            // 바코드 정보 생성
//            BitMatrix encode = new MultiFormatWriter().encode(url, BarcodeFormat.CODE_128, width, height);
            BitMatrix encode = new MultiFormatWriter().encode(dto.getProductId()+"A"+dto.getOptionId(), BarcodeFormat.CODE_128, width, height);

            // ByteArrayOutputStream에서 byte 배열로 변환
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(encode, "PNG", out);
            byte[] byteArray = out.toByteArray();

            // ByteArrayMultipartFile를 사용하여 MultipartFile 생성
            return new ByteArrayMultipartFile(byteArray, "file", "barcode.png", "image/png");
        } catch (NullPointerException e) {
            System.out.println(e.getMessage());
        }

        return null;
    }




}
