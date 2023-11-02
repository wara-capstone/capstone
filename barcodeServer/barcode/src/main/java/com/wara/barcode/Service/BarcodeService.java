package com.wara.barcode.Service;



import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import com.wara.barcode.DTO.BarcodeDTO;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import java.io.IOException;



@Service
public class BarcodeService {

    ObjectMapper objectMapper = new ObjectMapper();


    /**
     * dto의 id값으로 바코드를 구분/생성
     */
    public ResponseEntity<byte[]> createBarcode(BarcodeDTO dto) throws WriterException, IOException {
        // 바코드 사이즈
        int width = 800;
        int height = 200;

        // TODO: 아래 try-catch에서 바코드에 등록할 정보 커스텀 해야함
        //바코드 이미지 생성
        try {
            // DTO를 Stirng으로 변환
            String url = objectMapper.writeValueAsString(dto);

            // 바코드 정보 생성
            BitMatrix encode = new MultiFormatWriter().encode(url, BarcodeFormat.CODE_128, width, height);
            //output Stream
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            //Bitmatrix, file.format, outputStream
            MatrixToImageWriter.writeToStream(encode, "PNG", out);

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(out.toByteArray());
        }catch (Exception e){ System.out.println(e.getMessage());}

        return null;
    }




}
