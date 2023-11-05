package com.store.Service;

import com.store.DAO.StoreDAO;
import com.store.DTO.*;
import com.store.Entity.StoreEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class StoreServiceImpl implements StoreService {
    private final StoreDAO storeDAO;

    public StoreServiceImpl(@Autowired StoreDAO storeDAO) {
        this.storeDAO = storeDAO;
    }

    @Override
    public SimpleResponseDTO createStore(StoreDTO storeDTO) {
        StoreEntity storeEntity = toEntity(storeDTO);
        Map<String, Object> resultMap = storeDAO.createStore(storeEntity);

        SimpleResponseDTO simpleResponseDTO = toSimpleResponseDTO(resultMap);
        return simpleResponseDTO;
    }
    
    @Override
    public ResponseDTO readStoreById(Long storeId) {
        Map<String, Object> resultMap = storeDAO.readStoreById(storeId);

        ResponseDTO responseDTO = toResponseDTO(resultMap);
        return responseDTO;
    }

    @Override
    public ResponseDTO readStoreByName(String storeName) {
        Map<String, Object> resultMap = storeDAO.readStoreByName(storeName);

        ResponseDTO responseDTO = toResponseDTO(resultMap);
        return responseDTO;
    }

    @Override
    public ResponseDTO readStoreBySeller(String storeSeller) {
        Map<String, Object> resultMap = storeDAO.readStoreBySeller(storeSeller);

        ResponseDTO responseDTO = toResponseDTO(resultMap);
        return responseDTO;
    }

    @Override
    public ResponseDTO readStoreByCoordinate(CoordinateDTO coordinateDTO) {
        Map<String, Object> resultMap = storeDAO.readStoreByCoordinate(coordinateDTO.getMinX(), coordinateDTO.getMinY(), coordinateDTO.getMaxX(), coordinateDTO.getMaxY());

        ResponseDTO responseDTO = toResponseForMapDTO(resultMap);
        return responseDTO;
    }

    @Override
    public ResponseDTO readStoreByIdForMap(Long storeId) {
        Map<String, Object> resultMap = storeDAO.readStoreById(storeId);

        ResponseDTO responseDTO = toResponseForMapDTO(resultMap);
        return responseDTO;
    }

    @Override
    public ResponseDTO readStoreByNameForMap(String storeName) {
        Map<String, Object> resultMap = storeDAO.readStoreByName(storeName);

        ResponseDTO responseDTO = toResponseForMapDTO(resultMap);
        return responseDTO;
    }

    @Override
    public SimpleResponseDTO existStoreById(Long storeId) {
        Map<String, Object> resultMap = storeDAO.existStoreById(storeId);

        SimpleResponseDTO simpleResponseDTO = toSimpleResponseDTO(resultMap);
        return simpleResponseDTO;
    }

    @Override
    public SimpleResponseDTO updateStore(StoreDTO storeDTO){
        StoreEntity storeEntity = toEntity(storeDTO);
        Map<String, Object> existMap = storeDAO.existStoreByNameAndSeller(storeEntity.getStoreName(), storeEntity.getStoreSeller());
        SimpleResponseDTO simpleResponseDTO;

        if(existMap.get("result").equals("success")){
            Map<String, Object> resultMap = storeDAO.updateStore(storeEntity);
            simpleResponseDTO = toSimpleResponseDTO(resultMap);
        } else{
            simpleResponseDTO = toSimpleResponseDTO(existMap);
        }

        return simpleResponseDTO;
    }

    @Override
    public SimpleResponseDTO deleteStore(Long storeId) {
        Map<String, Object> resultMap = storeDAO.deleteStore(storeId);

        SimpleResponseDTO simpleResponseDTO = toSimpleResponseDTO(resultMap);
        return simpleResponseDTO;
    }

    @Override
    public StoreEntity toEntity(StoreDTO storeDTO) {
        StoreEntity storeEntity = StoreEntity.builder()
                .storeName(storeDTO.getStoreName())
                .storeAddress(storeDTO.getStoreAddress())
                .storeSeller(storeDTO.getStoreSeller())
                .storePhone(storeDTO.getStorePhone())
                .storeContents(storeDTO.getStoreContents())
                .storeImage(storeDTO.getStoreImage())
                .storeLocationX(storeDTO.getStoreLocationX())
                .storeLocationY(storeDTO.getStoreLocationY())
                .productIds(storeDTO.getProductId())
                .build();

        return storeEntity;
    }

    @Override
    public ResponseDTO toResponseDTO(Map<String, Object> resultMap) {
        ResponseDTO responseDTO;

        if (resultMap.containsKey("data")) {
            StoreEntity storeEntity = (StoreEntity) resultMap.get("data");
            ReadResponseDTO readResponseDTO = ReadResponseDTO.builder()
                    .storeId(storeEntity.getStoreId())
                    .storeName(storeEntity.getStoreName())
                    .storeAddress(storeEntity.getStoreAddress())
                    .storeSeller(storeEntity.getStoreSeller())
                    .storePhone(storeEntity.getStorePhone())
                    .storeContents(storeEntity.getStoreContents())
                    .storeImage(storeEntity.getStoreImage())
                    .storeLocationX(storeEntity.getStoreLocationX())
                    .storeLocationY(storeEntity.getStoreLocationY())
                    .productId(storeEntity.getProductIds())
                    .build();

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(readResponseDTO)
                    .build();
        } else if (resultMap.containsKey("dataList")) {
            List<StoreEntity> storeEntities = (List<StoreEntity>) resultMap.get("dataList");
            List<ReadResponseDTO> readResponseDTOS = new ArrayList<>();

            for (StoreEntity storeEntity : storeEntities) {
                ReadResponseDTO readResponseDTO = ReadResponseDTO.builder()
                        .storeId(storeEntity.getStoreId())
                        .storeName(storeEntity.getStoreName())
                        .storeAddress(storeEntity.getStoreAddress())
                        .storeSeller(storeEntity.getStoreSeller())
                        .storePhone(storeEntity.getStorePhone())
                        .storeContents(storeEntity.getStoreContents())
                        .storeImage(storeEntity.getStoreImage())
                        .storeLocationX(storeEntity.getStoreLocationX())
                        .storeLocationY(storeEntity.getStoreLocationY())
                        .productId(storeEntity.getProductIds())
                        .build();
                readResponseDTOS.add(readResponseDTO);
            }

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(readResponseDTOS)
                    .build();
        } else{
            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(null)
                    .build();
        }

        return responseDTO;
    }

    @Override
    public ResponseDTO toResponseForMapDTO(Map<String, Object> resultMap) {
        ResponseDTO responseDTO;

        if (resultMap.containsKey("data")) {
            StoreEntity storeEntity = (StoreEntity) resultMap.get("data");
            ReadResponseForMapDTO readResponseForMapDTO = ReadResponseForMapDTO.builder()
                    .storeId(storeEntity.getStoreId())
                    .storeName(storeEntity.getStoreName())
                    .storeAddress(storeEntity.getStoreAddress())
                    .storePhone(storeEntity.getStorePhone())
                    .storeImage(storeEntity.getStoreImage())
                    .storeLocationX(storeEntity.getStoreLocationX())
                    .storeLocationY(storeEntity.getStoreLocationY())
                    .build();

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(readResponseForMapDTO)
                    .build();
        } else if(resultMap.containsKey("dataList")){
            List<StoreEntity> storeEntities = (List<StoreEntity>) resultMap.get("dataList");

            if(storeEntities.isEmpty()){
                responseDTO = ResponseDTO.builder()
                        .result((String) resultMap.get("result"))
                        .data(null)
                        .build();
                return responseDTO;
            }

            List<ReadResponseForMapDTO> readResponseForMapDTOS = new ArrayList<>();

            for (StoreEntity storeEntity : storeEntities) {
                ReadResponseForMapDTO readResponseForMapDTO = ReadResponseForMapDTO.builder()
                        .storeId(storeEntity.getStoreId())
                        .storeName(storeEntity.getStoreName())
                        .storeAddress(storeEntity.getStoreAddress())
                        .storePhone(storeEntity.getStorePhone())
                        .storeImage(storeEntity.getStoreImage())
                        .storeLocationX(storeEntity.getStoreLocationX())
                        .storeLocationY(storeEntity.getStoreLocationY())
                        .build();
                readResponseForMapDTOS.add(readResponseForMapDTO);
            }

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(readResponseForMapDTOS)
                    .build();
        } else {
            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(null)
                    .build();
        }

        return responseDTO;
    }

    @Override
    public SimpleResponseDTO toSimpleResponseDTO(Map<String, Object> resultMap) {
        SimpleResponseDTO simpleResponseDTO;

        simpleResponseDTO = SimpleResponseDTO.builder()
                .result((String) resultMap.get("result"))
                .build();

        return simpleResponseDTO;
    }
}