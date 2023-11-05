package com.store.Repository;

import com.store.Entity.StoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreRepository extends JpaRepository<StoreEntity, String> {
    StoreEntity findByStoreId(Long storeId);
    StoreEntity findByStoreSeller(String storeSeller);
    List<StoreEntity> findByStoreName(String storeName);
    List<StoreEntity> findByStoreLocationXBetweenAndStoreLocationYBetween(Double minX, Double maxX, Double minY, Double maxY);
    StoreEntity findByStoreNameAndStoreSeller(String storeName, String storeSeller);
    Boolean existsByStoreNameAndStoreSeller(String storeName, String storeSeller);
    Boolean existsByStoreId(Long storeId);
}