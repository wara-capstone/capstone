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
import java.util.List;
import java.util.Optional;

@Service
public class ImageServiceImpl implements ImageService {

    private static final Logger logger = LoggerFactory.getLogger(ImageServiceImpl.class);
    private final ImageDAO imageDAO;

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
            imagesURI.add("http://localhost:8000/download/"+imageEntity.getId());
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
}
