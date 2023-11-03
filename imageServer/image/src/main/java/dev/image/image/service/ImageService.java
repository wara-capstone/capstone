package dev.image.image.service;


import dev.image.image.dto.ImageDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public interface ImageService {
    public ResponseEntity<ImageDTO> uploadImage(List<MultipartFile> images) throws IOException;
    public ResponseEntity<byte[]> downloadImage(Long id);
    public ResponseEntity<Boolean> deleteImage(Long id);

}
