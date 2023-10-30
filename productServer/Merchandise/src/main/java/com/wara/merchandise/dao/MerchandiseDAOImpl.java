package com.wara.merchandise.dao;


import com.wara.merchandise.entity.MerchandiseEntity;
import com.wara.merchandise.repository.MerchandiseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MerchandiseDAOImpl implements MerchandiseDAO{


    private final MerchandiseRepository repository;

    public MerchandiseDAOImpl(@Autowired MerchandiseRepository repository) {
        this.repository = repository;
    }



    @Override
    public HttpStatus initProduct(MerchandiseEntity entity)
    {
        repository.save(entity);
        return HttpStatus.OK;
    }

    @Override
    public MerchandiseEntity readProduct(String id) {
        return repository.getByItemId(id);
    }

    @Override
    public List<MerchandiseEntity> readProductList(String id) {
        return repository.getAllByCategory(id);
    }

    @Override
    public List<MerchandiseEntity> readAll() {
        return repository.getAll();
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }


}
