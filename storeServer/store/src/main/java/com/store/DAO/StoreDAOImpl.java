package com.store.DAO;

import com.store.Entity.StoreEntity;
import com.store.Repository.StoreRepository;
import com.store.Service.StoreServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class StoreDAOImpl implements StoreDAO {
    private final StoreRepository storeRepository;
    private final static Logger logger = LoggerFactory.getLogger(StoreDAOImpl.class);
    public StoreDAOImpl(@Autowired StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    @Override
    public Map<String, Object> createStore(StoreEntity storeEntity) {
        logger.info("DAO Layer - createStore: Creating store with data: {}", storeEntity);

        Map<String, Object> result = new HashMap<>();

        if (storeRepository.existsByStoreNameAndStoreSeller(storeEntity.getStoreName(), storeEntity.getStoreSeller()) || storeRepository.existsByStoreAddress(storeEntity.getStoreAddress())) {
            result.put("result", "fail");
            logger.info("DAO Layer - createStore: Store creation failed. Store with name '{}' and seller '{}' already exists or store with address '{}' already exists.", storeEntity.getStoreName(), storeEntity.getStoreSeller(), storeEntity.getStoreAddress());
            return result;
        }

        this.storeRepository.save(storeEntity);

        if (storeRepository.existsByStoreId(storeEntity.getStoreId())) {
            result.put("result", "success");
            logger.info("DAO Layer - createStore: Store created successfully with id '{}'.", storeEntity.getStoreId());
        } else {
            result.put("result", "fail");
            logger.info("DAO Layer - createStore: Store creation failed for unknown reasons.");
        }

        return result;
    }

    @Override
    public Map<String, Object> readStoreById(Long storeId) {
        logger.info("DAO Layer - readStoreById: Reading store by id '{}'", storeId);

        Map<String, Object> result = new HashMap<>();
        StoreEntity storeEntity = storeRepository.findByStoreId(storeId);

        if (storeEntity == null) {
            result.put("result", "fail");
            logger.info("DAO Layer - readStoreById: Store with id '{}' not found.", storeId);
        } else {
            result.put("result", "success");
            result.put("data", storeEntity);
            logger.info("DAO Layer - readStoreById: Store with id '{}' found.", storeId);
        }

        return result;
    }

    @Override
    public Map<String, Object> readStoreByName(String storeName) {
        logger.info("DAO Layer - readStoreByName: Reading store by name '{}'", storeName);

        Map<String, Object> result = new HashMap<>();
        List<StoreEntity> storeEntities = storeRepository.findByStoreName(storeName);

        if (storeEntities.isEmpty()) {
            result.put("result", "fail");
            logger.info("DAO Layer - readStoreByName: Store with name '{}' not found.", storeName);
        } else {
            result.put("result", "success");
            result.put("dataList", storeEntities);
            logger.info("DAO Layer - readStoreByName: Store(s) with name '{}' found.", storeName);
        }

        return result;
    }

    @Override
    public Map<String, Object> readStoreBySeller(String storeSeller) {
        logger.info("DAO Layer - readStoreBySeller: Reading store(s) by seller '{}'", storeSeller);

        Map<String, Object> result = new HashMap<>();
        List<StoreEntity> storeEntities = storeRepository.findByStoreSeller(storeSeller);

        if (storeEntities.isEmpty()) {
            result.put("result", "fail");
            logger.info("DAO Layer - readStoreBySeller: Store(s) with seller '{}' not found.", storeSeller);
        } else {
            result.put("result", "success");
            result.put("dataList", storeEntities);
            logger.info("DAO Layer - readStoreBySeller: Store(s) with seller '{}' found.", storeSeller);
        }

        return result;
    }

    @Override
    public Map<String, Object> readStoreByCoordinate(Double minX, Double minY, Double maxX, Double maxY) {
        logger.info("DAO Layer - readStoreByCoordinate: Reading store(s) by coordinate - minX: {}, minY: {}, maxX: {}, maxY: {}", minX, minY, maxX, maxY);

        Map<String, Object> result = new HashMap<>();
        List<StoreEntity> storeEntities = storeRepository.findByStoreLocationXBetweenAndStoreLocationYBetween(minX, maxX, minY, maxY);

        if (storeEntities.isEmpty()) {
            result.put("result", "fail");
            logger.info("DAO Layer - readStoreByCoordinate: No stores found within the specified coordinate range.");
        } else {
            result.put("result", "success");
            result.put("dataList", storeEntities);
            logger.info("DAO Layer - readStoreByCoordinate: Store(s) found within the specified coordinate range.");
        }

        return result;
    }

    @Override
    public String readStoreImageByStoreNameAndStoreSeller(String storeName, String storeSeller) {
        logger.info("DAO Layer - readStoreImageByStoreNameAndStoreSeller: Reading image for store with name '{}' and seller '{}'", storeName, storeSeller);

        String image = storeRepository.findStoreImageByStoreNameAndStoreSeller(storeName, storeSeller);
        if (image != null) {
            logger.info("DAO Layer - readStoreImageByStoreNameAndStoreSeller: Image found for store with name '{}' and seller '{}'", storeName, storeSeller);
            return image;
        } else {
            logger.info("DAO Layer - readStoreImageByStoreNameAndStoreSeller: Image not found for store with name '{}' and seller '{}'", storeName, storeSeller);
            return "fail";
        }
    }

    @Override
    public String readStoreImageByStoreId(Long storeId) {
        logger.info("DAO Layer - readStoreImageByStoreId: Reading image for store with id '{}'", storeId);

        String image = storeRepository.findStoreImageByStoreId(storeId);
        if (image != null) {
            logger.info("DAO Layer - readStoreImageByStoreId: Image found for store with id '{}'", storeId);
            return image;
        } else {
            logger.info("DAO Layer - readStoreImageByStoreId: Image not found for store with id '{}'", storeId);
            return "fail";
        }
    }

    @Override
    public Map<String, Object> existStoreById(Long storeId) {
        logger.info("DAO Layer - existStoreById: Checking if store exists with id '{}'", storeId);

        Map<String, Object> result = new HashMap<>();

        if (storeRepository.existsByStoreId(storeId)) {
            result.put("result", "success");
            logger.info("DAO Layer - existStoreById: Store with id '{}' exists.", storeId);
        } else {
            result.put("result", "fail");
            logger.info("DAO Layer - existStoreById: Store with id '{}' does not exist.", storeId);
        }

        return result;
    }

    @Override
    public Map<String, Object> existStoreBySeller(String storeSeller) {
        logger.info("DAO Layer - existStoreBySeller: Checking if store exists with seller '{}'", storeSeller);

        Map<String, Object> result = new HashMap<>();

        if (storeRepository.existsByStoreSeller(storeSeller)) {
            result.put("result", "success");
            logger.info("DAO Layer - existStoreBySeller: Store with seller '{}' exists.", storeSeller);
        } else {
            result.put("result", "fail");
            logger.info("DAO Layer - existStoreBySeller: Store with seller '{}' does not exist.", storeSeller);
        }

        return result;
    }

    @Override
    public Map<String, Object> existStoreByNameAndSeller(String storeName, String storeSeller) {
        logger.info("DAO Layer - existStoreByNameAndSeller: Checking if store exists with name '{}' and seller '{}'", storeName, storeSeller);

        Map<String, Object> result = new HashMap<>();

        if (storeRepository.existsByStoreNameAndStoreSeller(storeName, storeSeller)) {
            result.put("result", "success");
            logger.info("DAO Layer - existStoreByNameAndSeller: Store with name '{}' and seller '{}' exists.", storeName, storeSeller);
        } else {
            result.put("result", "fail");
            logger.info("DAO Layer - existStoreByNameAndSeller: Store with name '{}' and seller '{}' does not exist.", storeName, storeSeller);
        }

        return result;
    }

    @Override
    public Map<String, Object> updateStoreByNameAndSeller(StoreEntity storeEntity) {
        logger.info("DAO Layer - updateStoreByNameAndSeller: Updating store by name '{}' and seller '{}'", storeEntity.getStoreName(), storeEntity.getStoreSeller());

        Map<String, Object> result = new HashMap<>();
        StoreEntity oldStoreEntity = storeRepository.findByStoreNameAndStoreSeller(storeEntity.getStoreName(), storeEntity.getStoreSeller());

        if (oldStoreEntity != null) {
            storeEntity.setStoreId(Optional.ofNullable(storeEntity.getStoreId()).orElse(oldStoreEntity.getStoreId()));
            storeEntity.setStoreName(Optional.ofNullable(storeEntity.getStoreName()).orElse(oldStoreEntity.getStoreName()));
            storeEntity.setStoreAddress(Optional.ofNullable(storeEntity.getStoreAddress()).orElse(oldStoreEntity.getStoreAddress()));
            storeEntity.setStorePhone(Optional.ofNullable(storeEntity.getStorePhone()).orElse(oldStoreEntity.getStorePhone()));
            storeEntity.setStoreSeller(Optional.ofNullable(storeEntity.getStoreSeller()).orElse(oldStoreEntity.getStoreSeller()));
            storeEntity.setStoreLocationX(Optional.ofNullable(storeEntity.getStoreLocationX()).orElse(oldStoreEntity.getStoreLocationX()));
            storeEntity.setStoreLocationY(Optional.ofNullable(storeEntity.getStoreLocationY()).orElse(oldStoreEntity.getStoreLocationY()));
            storeEntity.setStoreImage(Optional.ofNullable(storeEntity.getStoreImage()).orElse(oldStoreEntity.getStoreImage()));
            storeEntity.setStoreContents(Optional.ofNullable(storeEntity.getStoreContents()).orElse(oldStoreEntity.getStoreContents()));
            storeEntity.setProductIds(Optional.ofNullable(storeEntity.getProductIds()).orElse(oldStoreEntity.getProductIds()));

            storeRepository.save(storeEntity);
            result.put("result", "success");
            logger.info("DAO Layer - updateStoreByNameAndSeller: Store updated successfully.");
        } else {
            result.put("result", "fail");
            logger.info("DAO Layer - updateStoreByNameAndSeller: Store with name '{}' and seller '{}' not found, update failed.", storeEntity.getStoreName(), storeEntity.getStoreSeller());
        }

        return result;
    }

    @Override
    public Map<String, Object> updateStoreById(StoreEntity storeEntity) {
        logger.info("DAO Layer - updateStoreById: Updating store by id '{}'", storeEntity.getStoreId());

        Map<String, Object> result = new HashMap<>();
        StoreEntity oldStoreEntity = storeRepository.findByStoreId(storeEntity.getStoreId());

        if (oldStoreEntity != null) {
            storeEntity.setStoreId(Optional.ofNullable(storeEntity.getStoreId()).orElse(oldStoreEntity.getStoreId()));
            storeEntity.setStoreName(Optional.ofNullable(storeEntity.getStoreName()).orElse(oldStoreEntity.getStoreName()));
            storeEntity.setStoreAddress(Optional.ofNullable(storeEntity.getStoreAddress()).orElse(oldStoreEntity.getStoreAddress()));
            storeEntity.setStorePhone(Optional.ofNullable(storeEntity.getStorePhone()).orElse(oldStoreEntity.getStorePhone()));
            storeEntity.setStoreSeller(Optional.ofNullable(storeEntity.getStoreSeller()).orElse(oldStoreEntity.getStoreSeller()));
            storeEntity.setStoreLocationX(Optional.ofNullable(storeEntity.getStoreLocationX()).orElse(oldStoreEntity.getStoreLocationX()));
            storeEntity.setStoreLocationY(Optional.ofNullable(storeEntity.getStoreLocationY()).orElse(oldStoreEntity.getStoreLocationY()));
            storeEntity.setStoreImage(Optional.ofNullable(storeEntity.getStoreImage()).orElse(oldStoreEntity.getStoreImage()));
            storeEntity.setStoreContents(Optional.ofNullable(storeEntity.getStoreContents()).orElse(oldStoreEntity.getStoreContents()));
            storeEntity.setProductIds(Optional.ofNullable(storeEntity.getProductIds()).orElse(oldStoreEntity.getProductIds()));

            storeRepository.save(storeEntity);
            result.put("result", "success");
            logger.info("DAO Layer - updateStoreById: Store updated successfully.");
        } else {
            result.put("result", "fail");
            logger.info("DAO Layer - updateStoreById: Store with id '{}' not found, update failed.", storeEntity.getStoreId());
        }

        return result;
    }

    @Override
    public Map<String, Object> deleteStore(Long storeId) {
        logger.info("DAO Layer - deleteStore: Deleting store by id '{}'", storeId);

        Map<String, Object> result = new HashMap<>();
        StoreEntity storeEntity = storeRepository.findByStoreId(storeId);

        if (storeEntity == null) {
            result.put("result", "fail");
            logger.info("DAO Layer - deleteStore: Store with id '{}' not found, deletion failed.", storeId);
        } else {
            storeRepository.delete(storeEntity);
            result.put("result", "success");
            logger.info("DAO Layer - deleteStore: Store with id '{}' deleted successfully.", storeId);
        }

        return result;
    }

    @Override
    public Boolean deleteProductId(Long storeId, Long productId) {
        logger.info("DAO Layer - deleteProductId: Deleting product with id '{}' from store with id '{}'", productId, storeId);

        StoreEntity storeEntity = storeRepository.findByStoreId(storeId);

        if (storeEntity != null) {
            List<Long> productIds = storeEntity.getProductIds();

            for (Long oldProductId : productIds) {
                if (productId.equals(oldProductId)) {
                    productIds.remove(productId);
                    break;
                }
            }

            storeEntity.setProductIds(productIds);

            storeRepository.save(storeEntity);
            logger.info("DAO Layer - deleteProductId: Product with id '{}' deleted successfully from store with id '{}'", productId, storeId);
            return true;
        } else {
            logger.info("DAO Layer - deleteProductId: Store with id '{}' not found, product deletion failed.", storeId);
            return false;
        }
    }
}