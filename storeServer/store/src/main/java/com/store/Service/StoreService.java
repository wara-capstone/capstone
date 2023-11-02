package com.store.Service;

import com.store.DTO.ResponseDTO;
import com.store.DTO.StoreDTO;
import com.store.Entity.StoreEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface StoreService {
    public ResponseDTO createStore(StoreDTO storeDTO);
    public ResponseDTO readStore(Long storeId);
    public ResponseDTO deleteStore(Long storeId);
    public StoreEntity toEntity(StoreDTO storeDTO);
    public ResponseDTO toResponseDTO(Map<String, Object> resultMap);
}
