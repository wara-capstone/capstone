package com.store.Service;

import com.store.DAO.StoreDAO;
import com.store.DTO.*;
import com.store.Entity.StoreEntity;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class StoreServiceImpl implements StoreService {
    private final StoreDAO storeDAO;
    private final HttpCommunicationService httpCommunicationService;
    private final static Logger logger = LoggerFactory.getLogger(StoreServiceImpl.class);

    public StoreServiceImpl(@Autowired StoreDAO storeDAO,
                            @Autowired HttpCommunicationService httpCommunicationService) {
        this.storeDAO = storeDAO;
        this.httpCommunicationService = httpCommunicationService;
    }

    @Override
    public SimpleResponseDTO createStore(StoreDTO storeDTO) {
        logger.info("Service Layer - createStore: Creating store with data: {}", storeDTO);
        StoreEntity storeEntity = toEntity(storeDTO);
        String imageUri = "https://onoff.zone/api/image/download/2";
        storeEntity.setStoreImage(imageUri);

        Map<String, Object> resultMap = storeDAO.createStore(storeEntity);
        SimpleResponseDTO simpleResponseDTO = toSimpleResponseDTO(resultMap);
        logger.info("Service Layer - createStore: Store created with result: {}", simpleResponseDTO);
        return simpleResponseDTO;
    }

    @Override
    public SimpleResponseDTO createStore(StoreDTO storeDTO, MultipartFile image) {
        logger.info("Service Layer - createStore with image: Creating store with data: {}", storeDTO);
        StoreEntity storeEntity = toEntity(storeDTO);

        try {
            String imageUri = httpCommunicationService.imageUpload(image);
            storeEntity.setStoreImage(imageUri);
            Map<String, Object> resultMap = storeDAO.createStore(storeEntity);
            SimpleResponseDTO simpleResponseDTO = toSimpleResponseDTO(resultMap);
            logger.info("Service Layer - createStore with image: Store created with result: {}", simpleResponseDTO);
            return simpleResponseDTO;
        } catch (URISyntaxException | IOException e) {
            logger.error("Service Layer - createStore with image: Failed to upload image", e);
            SimpleResponseDTO errorResponse = new SimpleResponseDTO("Failed to upload image");
            return errorResponse;
        }
    }

    @Override
    public ResponseDTO readStoreById(Long storeId) {
        logger.info("Service Layer - readStoreById: Reading store with ID: {}", storeId);
        Map<String, Object> resultMap = storeDAO.readStoreById(storeId);

        ResponseDTO responseDTO = toResponseDTO(resultMap);
        logger.info("Service Layer - readStoreById: Store read result: {}", responseDTO);
        return responseDTO;
    }

    @Override
    public ResponseDTO readStoreByName(String storeName) {
        logger.info("Service Layer - readStoreByName: Reading store with name: {}", storeName);
        Map<String, Object> resultMap = storeDAO.readStoreByName(storeName);

        ResponseDTO responseDTO = toResponseDTO(resultMap);
        logger.info("Service Layer - readStoreByName: Store read result: {}", responseDTO);
        return responseDTO;
    }

    @Override
    public ResponseDTO readStoreBySeller(String storeSeller) {
        logger.info("Service Layer - readStoreBySeller: Reading store with seller: {}", storeSeller);
        Map<String, Object> resultMap = storeDAO.readStoreBySeller(storeSeller);

        ResponseDTO responseDTO = toResponseDTO(resultMap);
        logger.info("Service Layer - readStoreBySeller: Store read result: {}", responseDTO);
        return responseDTO;
    }

    @Override
    public ResponseDTO readStoreByCoordinate(@NotNull CoordinateDTO coordinateDTO) {
        logger.info("Service Layer - readStoreByCoordinate: Reading store with coordinates: {}", coordinateDTO);
        Map<String, Object> resultMap = storeDAO.readStoreByCoordinate(coordinateDTO.getMinX(), coordinateDTO.getMinY(), coordinateDTO.getMaxX(), coordinateDTO.getMaxY());

        ResponseDTO responseDTO = toResponseForMapDTO(resultMap);
        logger.info("Service Layer - readStoreByCoordinate: Store read result: {}", responseDTO);
        return responseDTO;
    }

    @Override
    public ResponseDTO readStoreByIdForMap(Long storeId) {
        logger.info("Service Layer - readStoreByIdForMap: Reading store with ID for map: {}", storeId);
        Map<String, Object> resultMap = storeDAO.readStoreById(storeId);

        ResponseDTO responseDTO = toResponseForMapDTO(resultMap);
        logger.info("Service Layer - readStoreByIdForMap: Store read result: {}", responseDTO);
        return responseDTO;
    }

    @Override
    public ResponseDTO readStoreByNameForMap(String storeName) {
        logger.info("Service Layer - readStoreByNameForMap: Reading store with name for map: {}", storeName);
        Map<String, Object> resultMap = storeDAO.readStoreByName(storeName);

        ResponseDTO responseDTO = toResponseForMapDTO(resultMap);
        logger.info("Service Layer - readStoreByNameForMap: Store read result: {}", responseDTO);
        return responseDTO;
    }

    @Override
    public SimpleResponseDTO existStoreById(Long storeId) {
        logger.info("Service Layer - existStoreById: Checking existence of store with ID: {}", storeId);
        Map<String, Object> resultMap = storeDAO.existStoreById(storeId);

        SimpleResponseDTO simpleResponseDTO = toSimpleResponseDTO(resultMap);
        logger.info("Service Layer - existStoreById: Store existence check result: {}", simpleResponseDTO);
        return simpleResponseDTO;
    }

    @Override
    public SimpleResponseDTO existStoreBySeller(String storeSeller) {
        logger.info("Service Layer - existStoreBySeller: Checking existence of store with seller: {}", storeSeller);
        Map<String, Object> resultMap = storeDAO.existStoreBySeller(storeSeller);

        SimpleResponseDTO simpleResponseDTO = toSimpleResponseDTO(resultMap);
        logger.info("Service Layer - existStoreBySeller: Store existence check result: {}", simpleResponseDTO);
        return simpleResponseDTO;
    }

    @Override
    public SimpleResponseDTO updateStoreByNameAndSeller(StoreDTO storeDTO) {
        logger.info("Service Layer - updateStoreByNameAndSeller: Updating store with name and seller: {}", storeDTO);
        StoreEntity storeEntity = toEntity(storeDTO);
        Map<String, Object> existMap = storeDAO.existStoreByNameAndSeller(storeEntity.getStoreName(), storeEntity.getStoreSeller());
        SimpleResponseDTO simpleResponseDTO;

        if (existMap.get("result").equals("success")) {
            Map<String, Object> resultMap = storeDAO.updateStoreByNameAndSeller(storeEntity);
            simpleResponseDTO = toSimpleResponseDTO(resultMap);
            logger.info("Service Layer - updateStoreByNameAndSeller: Store updated successfully: {}", simpleResponseDTO);
        } else {
            simpleResponseDTO = toSimpleResponseDTO(existMap);
            logger.warn("Service Layer - updateStoreByNameAndSeller: Store update failed: {}", simpleResponseDTO);
        }

        return simpleResponseDTO;
    }

    @Override
    public SimpleResponseDTO updateStoreByNameAndSeller(StoreDTO storeDTO, MultipartFile image) {
        logger.info("Service Layer - updateStoreByNameAndSeller with image: Updating store with name and seller: {}", storeDTO);
        StoreEntity storeEntity = toEntity(storeDTO);
        Map<String, Object> existMap = storeDAO.existStoreByNameAndSeller(storeEntity.getStoreName(), storeEntity.getStoreSeller());
        SimpleResponseDTO simpleResponseDTO;

        if (!(existMap.get("result").equals("success"))) {
            simpleResponseDTO = toSimpleResponseDTO(existMap);
            logger.warn("Service Layer - updateStoreByNameAndSeller with image: Store update failed: {}", simpleResponseDTO);
            return simpleResponseDTO;
        }

        try {
            String oldImage = storeDAO.readStoreImageByStoreNameAndStoreSeller(storeEntity.getStoreName(), storeEntity.getStoreSeller());
            String imageKey = findImageKey(oldImage);
            String imageUri = httpCommunicationService.imageUpdate(image, imageKey);
            storeEntity.setStoreImage(imageUri);
            Map<String, Object> resultMap = storeDAO.updateStoreByNameAndSeller(storeEntity);
            simpleResponseDTO = toSimpleResponseDTO(resultMap);
            logger.info("Service Layer - updateStoreByNameAndSeller with image: Store updated successfully: {}", simpleResponseDTO);
            return simpleResponseDTO;
        } catch (URISyntaxException | IOException e) {
            logger.error("Service Layer - updateStoreByNameAndSeller with image: Failed to update image", e);
            SimpleResponseDTO errorResponse = new SimpleResponseDTO("Failed to update image");
            return errorResponse;
        }
    }

    @Override
    public SimpleResponseDTO updateStoreById(StoreDTO storeDTO) {
        logger.info("Service Layer - updateStoreById: Updating store with ID: {}", storeDTO.getStoreId());
        StoreEntity storeEntity = toEntity(storeDTO);
        Map<String, Object> existMap = storeDAO.existStoreById(storeDTO.getStoreId());
        SimpleResponseDTO simpleResponseDTO;

        if (existMap.get("result").equals("success")) {
            logger.info("Service Layer - updateStoreById: Store exists, proceeding with update");
            Map<String, Object> resultMap = storeDAO.updateStoreById(storeEntity);
            simpleResponseDTO = toSimpleResponseDTO(resultMap);
        } else {
            logger.warn("Service Layer - updateStoreById: Store does not exist");
            simpleResponseDTO = toSimpleResponseDTO(existMap);
        }

        logger.info("Service Layer - updateStoreById: Update result: {}", simpleResponseDTO);
        return simpleResponseDTO;
    }

    @Override
    public SimpleResponseDTO updateStoreById(StoreDTO storeDTO, MultipartFile image) {
        logger.info("Service Layer - updateStoreById with image: Updating store with ID: {}", storeDTO.getStoreId());
        StoreEntity storeEntity = toEntity(storeDTO);
        Map<String, Object> existMap = storeDAO.existStoreById(storeEntity.getStoreId());
        SimpleResponseDTO simpleResponseDTO;

        if (!(existMap.get("result").equals("success"))) {
            logger.warn("Service Layer - updateStoreById with image: Store does not exist");
            simpleResponseDTO = toSimpleResponseDTO(existMap);
            return simpleResponseDTO;
        }

        try {
            String oldImage = storeDAO.readStoreImageByStoreId(storeEntity.getStoreId());
            String imageKey = findImageKey(oldImage);
            String imageUri = httpCommunicationService.imageUpdate(image, imageKey);
            storeEntity.setStoreImage(imageUri);
            Map<String, Object> resultMap = storeDAO.updateStoreById(storeEntity);
            simpleResponseDTO = toSimpleResponseDTO(resultMap);
            logger.info("Service Layer - updateStoreById with image: Update successful with new image URI: {}", imageUri);
            return simpleResponseDTO;
        } catch (URISyntaxException | IOException e) {
            logger.error("Service Layer - updateStoreById with image: Failed to update image", e);
            SimpleResponseDTO errorResponse = new SimpleResponseDTO("Failed to update image");
            return errorResponse;
        }
    }

    @Override
    public SimpleResponseDTO deleteStore(Long storeId) {
        logger.info("Service Layer - deleteStore: Deleting store with ID: {}", storeId);
        try {
            String image = storeDAO.readStoreImageByStoreId(storeId);
            String imageKey = findImageKey(image);
            Boolean imageDeleteFlag = httpCommunicationService.imageDelete(imageKey);
            Boolean productDeleteFlag = httpCommunicationService.productDelete(storeId);

            if (imageDeleteFlag && productDeleteFlag) {
                Map<String, Object> resultMap = storeDAO.deleteStore(storeId);
                SimpleResponseDTO simpleResponseDTO = toSimpleResponseDTO(resultMap);
                logger.info("Service Layer - deleteStore: Store and associated image deleted successfully");
                return simpleResponseDTO;
            } else {
                logger.warn("Service Layer - deleteStore: Failed to delete image or product");
                SimpleResponseDTO errorResponse = new SimpleResponseDTO("Failed to delete image or product");
                return errorResponse;
            }
        } catch (URISyntaxException e) {
            logger.error("Service Layer - deleteStore: Failed to delete store", e);
            SimpleResponseDTO errorResponse = new SimpleResponseDTO("Failed to delete store");
            return errorResponse;
        }
    }

    @Override
    public SimpleResponseDTO deleteProduct(Long storeId, Long productId) {
        logger.info("Service Layer - deleteProduct: Deleting product with ID: {} from store with ID: {}", productId, storeId);
        Boolean flag = storeDAO.deleteProductId(storeId, productId);

        if (flag) {
            logger.info("Service Layer - deleteProduct: Product deleted successfully");
            return new SimpleResponseDTO("success");
        }

        logger.warn("Service Layer - deleteProduct: Failed to delete product");
        return new SimpleResponseDTO("fail");
    }

    @Override
    public StoreEntity toEntity(@NotNull StoreDTO storeDTO) {
        logger.info("Service Layer - toEntity: Converting StoreDTO to StoreEntity: {}", storeDTO);
        StoreEntity storeEntity = StoreEntity.builder()
                .storeId(storeDTO.getStoreId())
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
        logger.info("Service Layer - toEntity: Conversion result: {}", storeEntity);
        return storeEntity;
    }

    @Override
    public ResponseDTO toResponseDTO(@NotNull Map<String, Object> resultMap) {
        logger.info("Service Layer - toResponseDTO: Converting resultMap to ResponseDTO");
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
        } else {
            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(null)
                    .build();
        }

        logger.info("Service Layer - toResponseDTO: Conversion result: {}", responseDTO);
        return responseDTO;
    }

    @Override
    public ResponseDTO toResponseForMapDTO(@NotNull Map<String, Object> resultMap) {
        logger.info("Service Layer - toResponseForMapDTO: Converting resultMap to ResponseDTO");
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
        } else if (resultMap.containsKey("dataList")) {
            List<StoreEntity> storeEntities = (List<StoreEntity>) resultMap.get("dataList");

            if (storeEntities.isEmpty()) {
                logger.warn("Service Layer - toResponseForMapDTO: No data found in dataList");
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
            logger.warn("Service Layer - toResponseForMapDTO: No data found in resultMap");
            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(null)
                    .build();
        }

        logger.info("Service Layer - toResponseForMapDTO: Conversion result: {}", responseDTO);
        return responseDTO;
    }

    @Override
    public SimpleResponseDTO toSimpleResponseDTO(@NotNull Map<String, Object> resultMap) {
        logger.info("Service Layer - toSimpleResponseDTO: Converting resultMap to SimpleResponseDTO");
        SimpleResponseDTO simpleResponseDTO;

        simpleResponseDTO = SimpleResponseDTO.builder()
                .result((String) resultMap.get("result"))
                .build();

        logger.info("Service Layer - toSimpleResponseDTO: Conversion result: {}", simpleResponseDTO);
        return simpleResponseDTO;
    }

    public String findImageKey(String url) {
        logger.info("Service Layer - findImageKey: Extracting image key from URL: {}", url);
        // 정규 표현식 패턴을 정의
        Pattern pattern = Pattern.compile("/image/download/(\\d+)");

        // 패턴과 URL을 매칭
        Matcher matcher = pattern.matcher(url);

        String imageKey;
        // 매칭된 부분 찾기
        if (matcher.find()) {
            // 숫자를 문자열로 추출
            imageKey = matcher.group(1);
            logger.info("Service Layer - findImageKey: Found image key: {}", imageKey);
        } else {
            imageKey = null;
            logger.warn("Service Layer - findImageKey: No image key found in URL");
        }
        return imageKey;
    }
}