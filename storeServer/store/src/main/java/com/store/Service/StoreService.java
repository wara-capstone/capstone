package com.store.Service;

import com.store.DTO.*;
import com.store.Entity.StoreEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public interface StoreService {
    public SimpleResponseDTO createStore(StoreDTO storeDTO, MultipartFile image);
    public ResponseDTO readStoreById(Long storeId);
    public ResponseDTO readStoreByName(String storeName);
    public ResponseDTO readStoreBySeller(String storeSeller);
    public ResponseDTO readStoreByCoordinate(CoordinateDTO coordinateDTO);
    public ResponseDTO readStoreByIdForMap(Long storeId);
    public ResponseDTO readStoreByNameForMap(String storeName);
    public SimpleResponseDTO existStoreById(Long storeId);
    public SimpleResponseDTO updateStore(StoreDTO storeDTO);
    public SimpleResponseDTO deleteStore(Long storeId);
    public StoreEntity toEntity(StoreDTO storeDTO);
    public ResponseDTO toResponseDTO(Map<String, Object> resultMap);
    public ResponseDTO toResponseForMapDTO(Map<String, Object> resultMap);
    public SimpleResponseDTO toSimpleResponseDTO(Map<String, Object> resultMap);
}
