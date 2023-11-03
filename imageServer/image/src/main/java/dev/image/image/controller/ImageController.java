package dev.image.image.controller;

import dev.image.image.dto.ImageDTO;
import dev.image.image.service.ImageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("image")
public class ImageController {

    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);
    private final ImageService imageService;

    public  ImageController(
            @Autowired ImageService imageService
    ){
        this.imageService = imageService;
    }


    @PostMapping("/upload")
    public ResponseEntity<ImageDTO> uploadImage(
            @RequestPart List<MultipartFile> images
    ) throws IOException {
        logger.info("[upload image]");
      return this.imageService.uploadImage(images);
    }

    @GetMapping(value = "/download/{id}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public  ResponseEntity<byte[]> downloadImage(
            @PathVariable("id") Long id
    ){
        logger.info("[download image] " + id);
        return this.imageService.downloadImage(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteImage(
            @PathVariable("id") Long id
    ){
        logger.info("[delete Image] "+id);
        return this.imageService.deleteImage(id);
    }

}
