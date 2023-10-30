package com.wara.merchandise.dao;

import com.wara.merchandise.entity.MerchandiseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;

public interface MerchandiseDAO {
    HttpStatus initProduct(MerchandiseEntity entity);
    MerchandiseEntity readProduct(String id);
    List<MerchandiseEntity> readProductList(String id);
    List<MerchandiseEntity> readAll();
    void delete(String id);
}
