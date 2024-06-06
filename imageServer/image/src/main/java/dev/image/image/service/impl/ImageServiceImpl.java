package dev.image.image.service.impl;

import dev.image.image.dao.ImageDAO;
import dev.image.image.dto.ImageDTO;
import dev.image.image.entity.ImageEntity;
import dev.image.image.service.ImageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class ImageServiceImpl implements ImageService {

    private static final Logger logger = LoggerFactory.getLogger(ImageServiceImpl.class);
    private final ImageDAO imageDAO;
    private static final Long[] ids = {1L, 2L, 3L};

    public  ImageServiceImpl(
            @Autowired ImageDAO imageDAO
    ){
        this.imageDAO = imageDAO;
    }


    @Override
    public ResponseEntity<ImageDTO> uploadImage(List<MultipartFile> images) throws IOException {
        List<String> imagesURI = new ArrayList<>();
        for(MultipartFile image : images){
            ImageEntity imageEntity = this.imageDAO.uploadImage(ImageEntity.builder().image(image.getBytes()).build());
            imagesURI.add("https://www.onoff.zone/api/image/download/"+imageEntity.getId());
        }

        return ResponseEntity.status(201)
                .body(ImageDTO.builder()
                        .result("success")
                        .images(imagesURI).build());
    }

    @Override
    public ResponseEntity<byte[]> downloadImage(Long id) {
        Optional<ImageEntity> image = this.imageDAO.downloadImage(id);
        if(!image.isPresent())
            return ResponseEntity.status(404).body(null);

        return ResponseEntity.status(200)
                .body(image.get().getImage());
    }

    @Override
    public ResponseEntity<String> updateImage(Long id, MultipartFile image) throws IOException {
        Optional<ImageEntity> optionalImage = this.imageDAO.downloadImage(id);
        if(!optionalImage.isPresent()){
            return ResponseEntity.status(400).body(null);
        }
        ImageEntity imageEntity = optionalImage.get();
        imageEntity = ImageEntity.builder()
                .id(imageEntity.getId())
                .image(image.getBytes())
                .build();
        imageEntity = this.imageDAO.uploadImage(imageEntity);

        return ResponseEntity.status(200).body("https://www.onoff.zone/api/image/download/"+imageEntity.getId());
    }

    @Override
    public ResponseEntity<Boolean> deleteImage(Long id) {
        for(Long i : ids){
            if(i.equals(id)) return ResponseEntity.status(200).body(false);
        }

        if(!this.imageDAO.deleteImage(id)){
            return ResponseEntity.status(400).body(false);
        }
        return ResponseEntity.status(200).body(true);
    }
}
