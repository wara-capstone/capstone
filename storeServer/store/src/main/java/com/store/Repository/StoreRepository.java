package com.store.Repository;

import com.store.Entity.StoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreRepository extends JpaRepository<StoreEntity, String> {
    StoreEntity findByStoreId(Long storeId);
    List<StoreEntity> findByStoreSeller(String storeSeller);
    List<StoreEntity> findByStoreName(String storeName);
    List<StoreEntity> findByStoreLocationXBetweenAndStoreLocationYBetween(Double minX, Double maxX, Double minY, Double maxY);
    StoreEntity findByStoreNameAndStoreSeller(String storeName, String storeSeller);
    @Query("SELECT se.storeImage FROM StoreEntity se WHERE se.storeName = :storeName AND se.storeSeller = :storeSeller")
    String findStoreImageByStoreNameAndStoreSeller(@Param("storeName") String storeName, @Param("storeSeller") String storeSeller);
    @Query("SELECT se.storeImage FROM StoreEntity se WHERE se.storeId = :storeId")
    String findStoreImageByStoreId(@Param("storeId") Long storeId);
    Boolean existsByStoreNameAndStoreSeller(String storeName, String storeSeller);
    Boolean existsByStoreId(Long storeId);
    Boolean existsByStoreSeller(String storeSeller);
}