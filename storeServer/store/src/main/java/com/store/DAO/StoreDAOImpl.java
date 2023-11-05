package com.store.DAO;

import com.store.Entity.StoreEntity;
import com.store.Repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class StoreDAOImpl implements StoreDAO {
    private final StoreRepository storeRepository;

    public StoreDAOImpl(@Autowired StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    @Override
    public Map<String, Object> createStore(StoreEntity storeEntity) {
        Map<String, Object> result = new HashMap<>();

        if(storeRepository.existsByStoreNameAndStoreSeller(storeEntity.getStoreName(), storeEntity.getStoreSeller())){
            result.put("result", "fail");
            return result;
        }

        this.storeRepository.save(storeEntity);

        if (storeRepository.existsByStoreId(storeEntity.getStoreId())) {
            result.put("result", "success");
        } else {
            result.put("result", "fail");
        }

        return result;
    }

    @Override
    public Map<String, Object> readStoreById(Long storeId) {
        Map<String, Object> result = new HashMap<>();
        StoreEntity storeEntity = storeRepository.findByStoreId(storeId);

        if (storeEntity == null) {
            result.put("result", "fail");
        } else {
            result.put("result", "success");
            result.put("data", storeEntity);
        }

        return result;
    }

    @Override
    public Map<String, Object> readStoreByName(String storeName) {
        Map<String, Object> result = new HashMap<>();
        List<StoreEntity> storeEntities = storeRepository.findByStoreName(storeName);

        if (storeEntities.isEmpty()) {
            result.put("result", "fail");
        } else {
            result.put("result", "success");
            result.put("dataList", storeEntities);
        }

        return result;
    }

    @Override
    public Map<String, Object> readStoreBySeller(String storeSeller) {
        Map<String, Object> result = new HashMap<>();
        StoreEntity storeEntity = storeRepository.findByStoreSeller(storeSeller);

        if (storeEntity == null) {
            result.put("result", "fail");
        } else {
            result.put("result", "success");
            result.put("data", storeEntity);
        }

        return result;
    }

    @Override
    public Map<String, Object> readStoreByCoordinate(Double minX, Double minY, Double maxX, Double maxY) {
        Map<String, Object> result = new HashMap<>();
        List<StoreEntity> storeEntities = storeRepository.findByStoreLocationXBetweenAndStoreLocationYBetween(minX,maxX,minY,maxY);

        if (storeEntities.isEmpty()) {
            result.put("result", "fail");
        } else {
            result.put("result", "success");
            result.put("dataList", storeEntities);
        }

        return result;
    }

    @Override
    public Map<String, Object> existStoreById(Long storeId) {
        Map<String, Object> result = new HashMap<>();

        if (storeRepository.existsByStoreId(storeId)) {
            result.put("result", "success");
        } else {
            result.put("result", "fail");
        }

        return result;
    }

    @Override
    public Map<String, Object> existStoreByNameAndSeller(String storeName, String storeSeller){
        Map<String, Object> result = new HashMap<>();

        if (storeRepository.existsByStoreNameAndStoreSeller(storeName, storeSeller)) {
            result.put("result", "success");
        } else {
            result.put("result", "fail");
        }

        return result;
    }

    @Override
    public Map<String, Object> updateStore(StoreEntity storeEntity){
        Map<String, Object> result = new HashMap<>();
        StoreEntity oldStoreEntity = storeRepository.findByStoreNameAndStoreSeller(storeEntity.getStoreName(), storeEntity.getStoreSeller());

        if(oldStoreEntity != null){
            storeEntity.setStoreId(Optional.ofNullable(storeEntity.getStoreId()).orElse(oldStoreEntity.getStoreId()));
            storeEntity.setStoreName(Optional.ofNullable(storeEntity.getStoreName()).orElse(oldStoreEntity.getStoreName()));
            storeEntity.setStoreAddress(Optional.ofNullable(storeEntity.getStoreAddress()).orElse(storeEntity.getStoreAddress()));
            storeEntity.setStorePhone(Optional.ofNullable(storeEntity.getStorePhone()).orElse(storeEntity.getStorePhone()));
            storeEntity.setStoreSeller(Optional.ofNullable(storeEntity.getStoreSeller()).orElse(storeEntity.getStoreSeller()));
            storeEntity.setStoreLocationX(Optional.ofNullable(storeEntity.getStoreLocationX()).orElse(storeEntity.getStoreLocationX()));
            storeEntity.setStoreLocationY(Optional.ofNullable(storeEntity.getStoreLocationY()).orElse(storeEntity.getStoreLocationY()));
            storeEntity.setStoreImage(Optional.ofNullable(storeEntity.getStoreImage()).orElse(storeEntity.getStoreImage()));
            storeEntity.setStoreContents(Optional.ofNullable(storeEntity.getStoreContents()).orElse(storeEntity.getStoreContents()));
            storeEntity.setProductIds(Optional.ofNullable(storeEntity.getProductIds()).orElse(storeEntity.getProductIds()));

            storeRepository.save(storeEntity);
            result.put("result", "success");
        } else{
            result.put("result", "fail");
        }

        return result;
    }

    @Override
    public Map<String, Object> deleteStore(Long storeId) {
        Map<String, Object> result = new HashMap<>();
        StoreEntity storeEntity = storeRepository.findByStoreId(storeId);

        if(storeEntity == null){
            result.put("result", "fail");
        } else{
            storeRepository.delete(storeEntity);
            result. put("result", "success");
        }

        return result;
    }
}