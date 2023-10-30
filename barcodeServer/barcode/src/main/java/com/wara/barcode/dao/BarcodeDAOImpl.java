package com.wara.barcode.dao;

import com.wara.barcode.entity.BarcodeEntity;
import com.wara.barcode.repository.BarcodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
//import com.wara.barcode.repository.BarcodeRepository;

public class BarcodeDAOImpl implements BarcodeDAO{



    private final BarcodeRepository barcodeRepository;

    public BarcodeDAOImpl(@Autowired BarcodeRepository barcodeRepository) {
        this.barcodeRepository = barcodeRepository;
    }

    @Override
    public void create() {

    }

    @Override
    public BarcodeEntity read(String id) {
        return this.barcodeRepository.getById(id);
    }

    @Override
    public void update() {

    }

    @Override
    public void delete() {

    }
}
