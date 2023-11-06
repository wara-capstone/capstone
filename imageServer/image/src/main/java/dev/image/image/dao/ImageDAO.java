package dev.image.image.dao;


import dev.image.image.entity.ImageEntity;

import java.util.Optional;

public interface ImageDAO {
    public ImageEntity uploadImage(ImageEntity imageEntity);
    public Optional<ImageEntity> downloadImage(Long id);

}
