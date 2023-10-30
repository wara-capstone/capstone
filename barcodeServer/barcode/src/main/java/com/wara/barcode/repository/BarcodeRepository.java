package com.wara.barcode.repository;

import com.wara.barcode.entity.BarcodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BarcodeRepository extends JpaRepository<BarcodeEntity, String> {
    public BarcodeEntity getById(String id);
}
