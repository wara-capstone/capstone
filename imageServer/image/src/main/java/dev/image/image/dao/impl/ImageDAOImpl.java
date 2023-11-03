package dev.image.image.dao.impl;

import dev.image.image.dao.ImageDAO;
import dev.image.image.entity.ImageEntity;
import dev.image.image.repository.ImageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class ImageDAOImpl implements ImageDAO {
    private static final Logger logger = LoggerFactory.getLogger(ImageDAOImpl.class);
    private final ImageRepository imageRepository;

    public  ImageDAOImpl(
            @Autowired ImageRepository imageRepository
    ){
        this.imageRepository = imageRepository;
    }
    @Override
    public ImageEntity uploadImage(ImageEntity imageEntity) {
        return this.imageRepository.save(imageEntity);
    }

    @Override
    public Optional<ImageEntity> downloadImage(Long id) {
        return this.imageRepository.findById(id);
    }

    @Override
    public boolean deleteImage(Long id, String email) {
        if(!this.imageRepository.existsById(id)){
            return false;
        }
        if(!this.imageRepository.findById(id).get().getEmail().equals(email)){
            return false;
        }
        this.imageRepository.deleteById(id);
        return true;
    }
}
