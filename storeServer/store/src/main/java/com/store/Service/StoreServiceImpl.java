package com.store.Service;

import com.store.DAO.StoreDAO;
import com.store.DTO.ResponseDTO;
import com.store.DTO.StoreDTO;
import com.store.Entity.StoreEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class StoreServiceImpl implements StoreService{
    private final StoreDAO storeDAO;

    public StoreServiceImpl(@Autowired StoreDAO storeDAO) {
        this.storeDAO = storeDAO;
    }

    @Override
    public ResponseDTO createStore(StoreDTO storeDTO) {
        StoreEntity storeEntity = toEntity(storeDTO);
        Map<String, Object> resultMap = storeDAO.createStore(storeEntity);

        ResponseDTO responseDTO = toResponseDTO(resultMap);
        return responseDTO;
    }

    @Override
    public ResponseDTO readStore(Long storeId) {
        Map<String, Object> resultMap = storeDAO.readStore(storeId);

        ResponseDTO responseDTO = toResponseDTO(resultMap);
        return responseDTO;
    }

    @Override
    public ResponseDTO deleteStore(Long storeId) {
        Map<String, Object> resultMap = storeDAO.deleteStore(storeId);

        ResponseDTO responseDTO = toResponseDTO(resultMap);
        return responseDTO;
    }

    public StoreEntity toEntity(StoreDTO storeDTO){
        StoreEntity storeEntity = StoreEntity.builder()
                .storeName(storeDTO.getStoreName())
                .storeAddress(storeDTO.getStoreAddress())
                .storeSeller(storeDTO.getStoreSeller())
                .storeContents(storeDTO.getStoreContents())
                .storeImage(storeDTO.getStoreImage())
                .storeLocationX(storeDTO.getStoreLocationX())
                .storeLocationY(storeDTO.getStoreLocationY())
                .productIds(storeDTO.getProductId())
                .build();

        return storeEntity;
    }

    public ResponseDTO toResponseDTO(Map<String, Object> resultMap){
        ResponseDTO responseDTO;

        if(resultMap.containsKey("data")) {
            StoreEntity storeEntity = (StoreEntity) resultMap.get("data");
            responseDTO = ResponseDTO.builder()
                    .storeId(storeEntity.getStoreId())
                    .storeName(storeEntity.getStoreName())
                    .storeAddress(storeEntity.getStoreAddress())
                    .storeSeller(storeEntity.getStoreSeller())
                    .storeContents(storeEntity.getStoreContents())
                    .storeImage(storeEntity.getStoreImage())
                    .storeLocationX(storeEntity.getStoreLocationX())
                    .storeLocationY(storeEntity.getStoreLocationY())
                    .productId(storeEntity.getProductIds())
                    .result((String) resultMap.get("result"))
                    .build();
        } else{
            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .build();
        }

        return responseDTO;
    }
}