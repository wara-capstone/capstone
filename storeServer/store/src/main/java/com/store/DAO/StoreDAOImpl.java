package com.store.DAO;

import com.store.Entity.StoreEntity;
import com.store.Repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
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
        this.storeRepository.save(storeEntity);

        if (storeRepository.existsByStoreId(storeEntity.getStoreId())) {
            result.put("result", "success");
        } else {
            result.put("result", "fail");
        }

        return result;
    }

    @Override
    public Map<String, Object> readStore(Long storeId) {
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