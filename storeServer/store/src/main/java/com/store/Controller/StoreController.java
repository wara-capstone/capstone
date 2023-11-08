package com.store.Controller;

import com.store.DTO.*;
import com.store.Service.StoreService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/store")
public class StoreController {
    private final StoreService storeService;
    private final static Logger logger = LoggerFactory.getLogger(StoreController.class);

    public StoreController(@Autowired StoreService storeService) {
        this.storeService = storeService;
    }

    @PostMapping(value = "/create", consumes = "application/json")
    public ResponseEntity<SimpleResponseDTO> createStore(@RequestBody StoreDTO storeDTO) {
        logger.info("[Request] : CreateStore(No Image)");
        logger.info("[Data]: " + storeDTO.toString());
        SimpleResponseDTO response = storeService.createStore(storeDTO);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(201).body(response);
    }

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<SimpleResponseDTO> createStore(@RequestPart("image") MultipartFile image,
                                                         @RequestPart("json") StoreDTO storeDTO) {
        logger.info("[Request] : CreateStore(Image)");
        logger.info("[Data]: " + storeDTO.toString());
        SimpleResponseDTO response = storeService.createStore(storeDTO, image);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping(value = "/read/id/{storeId}")
    public ResponseEntity<ResponseDTO> readStoreById(@PathVariable Long storeId) {
        logger.info("[Request] : ReadStoreById");
        logger.info("[Data]: " + storeId);
        ResponseDTO response = storeService.readStoreById(storeId);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping(value = "/read/name/{storeName}")
    public ResponseEntity<ResponseDTO> readStoreByName(@PathVariable String storeName) {
        logger.info("[Request] : ReadStoreByName");
        logger.info("[Data]: " + storeName);
        ResponseDTO response = storeService.readStoreByName(storeName);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping(value = "/read/seller/{storeSeller}")
    public ResponseEntity<ResponseDTO> readStoreBySeller(@PathVariable String storeSeller) {
        logger.info("[Request] : ReadStoreBySeller");
        logger.info("[Data]: " + storeSeller);
        ResponseDTO response = storeService.readStoreBySeller(storeSeller);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @PostMapping(value = "/read/map/coordinate")
    public ResponseEntity<ResponseDTO> readStoreByCoordinate(@RequestBody CoordinateDTO coordinateDTO) {
        logger.info("[Request] : ReadStoreByCoordinate");
        logger.info("[Data]: " + coordinateDTO.toString());
        ResponseDTO response = storeService.readStoreByCoordinate(coordinateDTO);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping(value = "/read/map/id/{storeId}")
    public ResponseEntity<ResponseDTO> readStoreByIdForMap(@PathVariable Long storeId) {
        logger.info("[Request] : ReadStoreByIdForMap");
        logger.info("[Data]: " + storeId);
        ResponseDTO response = storeService.readStoreByIdForMap(storeId);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping(value = "/read/map/name/{storeName}")
    public ResponseEntity<ResponseDTO> readStoreByNameForMap(@PathVariable String storeName) {
        logger.info("[Request] : ReadStoreByNameForMap");
        logger.info("[Data]: " + storeName);
        ResponseDTO response = storeService.readStoreByNameForMap(storeName);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping(value = "/exist/id/{storeId}")
    public ResponseEntity<SimpleResponseDTO> existStoreById(@PathVariable Long storeId) {
        logger.info("[Request] : ExistStoreById");
        logger.info("[Data]: " + storeId);
        SimpleResponseDTO response = storeService.existStoreById(storeId);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping(value = "/exist/seller/{storeSeller}")
    public ResponseEntity<SimpleResponseDTO> existStoreBySeller(@PathVariable String storeSeller) {
        logger.info("[Request] : ExistStoreBySeller");
        logger.info("[Data]: " + storeSeller);
        SimpleResponseDTO response = storeService.existStoreBySeller(storeSeller);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @PutMapping(value = "/update", consumes = "application/json")
    public ResponseEntity<SimpleResponseDTO> updateStoreByNameAndSeller(@RequestBody StoreDTO storeDTO) {
        logger.info("[Request] : UpdateStoreByNameAndSeller(No Image)");
        logger.info("[Data]: " + storeDTO.toString());
        SimpleResponseDTO response = storeService.updateStoreByNameAndSeller(storeDTO);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @PutMapping(value = "/update", consumes = "multipart/form-data")
    public ResponseEntity<SimpleResponseDTO> updateStoreByNameAndSeller(@RequestPart("image") MultipartFile image,
                                                                        @RequestPart("json") StoreDTO storeDTO) {
        logger.info("[Request] : UpdateStoreByNameAndSeller(Image)");
        logger.info("[Data]: " + storeDTO.toString());
        SimpleResponseDTO response = storeService.updateStoreByNameAndSeller(storeDTO, image);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @PutMapping(value = "/update/id", consumes = "application/json")
    public ResponseEntity<SimpleResponseDTO> updateStoreById(@RequestBody StoreDTO storeDTO) {
        logger.info("[Request] : UpdateStoreById(No Image)");
        logger.info("[Data]: " + storeDTO.toString());
        SimpleResponseDTO response = storeService.updateStoreById(storeDTO);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @PutMapping(value = "/update/id", consumes = "multipart/form-data")
    public ResponseEntity<SimpleResponseDTO> updateStoreById(@RequestPart("image") MultipartFile image,
                                                             @RequestPart("json") StoreDTO storeDTO) {
        logger.info("[Request] : UpdateStoreById(Image)");
        logger.info("[Data]: " + storeDTO.toString());
        SimpleResponseDTO response = storeService.updateStoreById(storeDTO, image);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @DeleteMapping(value = "/delete/id/{storeId}")
    public ResponseEntity<SimpleResponseDTO> deleteStore(@PathVariable Long storeId) {
        logger.info("[Request] : DeleteStoreById");
        logger.info("[Data]: " + storeId);
        SimpleResponseDTO response = storeService.deleteStore(storeId);
        logger.info("[Response] : " + response.toString());
        return ResponseEntity.status(200).body(response);
    }
}