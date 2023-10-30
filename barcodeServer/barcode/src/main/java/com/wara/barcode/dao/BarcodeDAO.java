package com.wara.barcode.dao;

import com.wara.barcode.entity.BarcodeEntity;

public interface BarcodeDAO {

    public void create();
    public BarcodeEntity read(String id);
    public void update();
    public void delete();

}
