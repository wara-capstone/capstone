package com.store.DAO;

import com.store.Entity.StoreEntity;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public interface StoreDAO {
    public Map<String, Object> createStore(StoreEntity storeEntity);
    public Map<String, Object> readStoreById(Long storeId);
    public Map<String, Object> readStoreByName(String storeName);
    public Map<String, Object> existStoreById(Long storeId);
    public Map<String, Object> deleteStore(Long storeId);
}
