package com.store.Repository;

import com.store.Entity.StoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreRepository extends JpaRepository<StoreEntity, String> {
    StoreEntity findByStoreId(Long storeId);
    List<StoreEntity> findByStoreName(String storeName);
    Boolean existsByStoreId(Long storeId);
}
