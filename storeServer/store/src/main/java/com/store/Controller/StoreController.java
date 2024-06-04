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
@RequestMapping("/api/store")
public class StoreController {
    private final StoreService storeService;
    private final static Logger logger = LoggerFactory.getLogger(StoreController.class);

    public StoreController(@Autowired StoreService storeService) {
        this.storeService = storeService;
    }

    @PostMapping(value = "/create", consumes = "application/json")
    public ResponseEntity<SimpleResponseDTO> createStore(@RequestBody StoreDTO storeDTO) {
        logger.info("Controller Layer - createStore: Creating store without image...");
        SimpleResponseDTO response = storeService.createStore(storeDTO);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - createStore: Store creation successful");
            return ResponseEntity.status(201).body(response);
        }
        logger.error("Controller Layer - createStore: Failed to create store");
        return ResponseEntity.status(500).body(null);
    }

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<SimpleResponseDTO> createStore(@RequestPart("image") MultipartFile image,
                                                         @RequestPart("json") StoreDTO storeDTO) {
        logger.info("Controller Layer - createStore: Creating store with image...");
        SimpleResponseDTO response = storeService.createStore(storeDTO, image);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - createStore: Store creation successful");
            return ResponseEntity.status(201).body(response);
        }
        logger.error("Controller Layer - createStore: Failed to create store");
        return ResponseEntity.status(500).body(null);
    }

    @GetMapping(value = "/read/id/{storeId}")
    public ResponseEntity<ResponseDTO> readStoreById(@PathVariable Long storeId) {
        logger.info("Controller Layer - readStoreById: Reading store by ID...");
        ResponseDTO response = storeService.readStoreById(storeId);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - readStoreById: Store retrieval successful");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - readStoreById: Failed to read store");
        return ResponseEntity.status(500).body(null);
    }

    @GetMapping(value = "/read/name/{storeName}")
    public ResponseEntity<ResponseDTO> readStoreByName(@PathVariable String storeName) {
        logger.info("Controller Layer - readStoreByName: Reading store by name...");
        ResponseDTO response = storeService.readStoreByName(storeName);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - readStoreByName: Store retrieval successful");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - readStoreByName: Failed to read store");
        return ResponseEntity.status(500).body(null);
    }

    @GetMapping(value = "/read/seller/{storeSeller}")
    public ResponseEntity<ResponseDTO> readStoreBySeller(@PathVariable String storeSeller) {
        logger.info("Controller Layer - readStoreBySeller: Reading store by seller...");
        ResponseDTO response = storeService.readStoreBySeller(storeSeller);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - readStoreBySeller: Store retrieval successful");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - readStoreBySeller: Failed to read store");
        return ResponseEntity.status(500).body(null);
    }

    @PostMapping(value = "/read/map/coordinate")
    public ResponseEntity<ResponseDTO> readStoreByCoordinate(@RequestBody CoordinateDTO coordinateDTO) {
        logger.info("Controller Layer - readStoreByCoordinate: Reading store by coordinate...");
        ResponseDTO response = storeService.readStoreByCoordinate(coordinateDTO);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - readStoreByCoordinate: Store retrieval successful");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - readStoreByCoordinate: Failed to read store");
        return ResponseEntity.status(500).body(null);
    }

    @GetMapping(value = "/read/map/id/{storeId}")
    public ResponseEntity<ResponseDTO> readStoreByIdForMap(@PathVariable Long storeId) {
        logger.info("Controller Layer - readStoreByIdForMap: Reading store by ID for map...");
        ResponseDTO response = storeService.readStoreByIdForMap(storeId);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - readStoreByIdForMap: Store retrieval successful");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - readStoreByIdForMap: Failed to read store");
        return ResponseEntity.status(500).body(null);
    }

    @GetMapping(value = "/read/map/name/{storeName}")
    public ResponseEntity<ResponseDTO> readStoreByNameForMap(@PathVariable String storeName) {
        logger.info("Controller Layer - readStoreByNameForMap: Reading store by name for map...");
        ResponseDTO response = storeService.readStoreByNameForMap(storeName);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - readStoreByNameForMap: Store retrieval successful");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - readStoreByNameForMap: Failed to read store");
        return ResponseEntity.status(500).body(null);
    }

    @GetMapping(value = "/exist/id/{storeId}")
    public ResponseEntity<SimpleResponseDTO> existStoreById(@PathVariable Long storeId) {
        logger.info("Controller Layer - existStoreById: Checking if store exists by ID...");
        SimpleResponseDTO response = storeService.existStoreById(storeId);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - existStoreById: Store exists");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - existStoreById: Store does not exist");
        return ResponseEntity.status(500).body(null);
    }

    @GetMapping(value = "/exist/seller/{storeSeller}")
    public ResponseEntity<SimpleResponseDTO> existStoreBySeller(@PathVariable String storeSeller) {
        logger.info("Controller Layer - existStoreBySeller: Checking if store exists by seller...");
        SimpleResponseDTO response = storeService.existStoreBySeller(storeSeller);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - existStoreBySeller: Store exists");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - existStoreBySeller: Store does not exist");
        return ResponseEntity.status(500).body(null);
    }

    @PutMapping(value = "/update", consumes = "application/json")
    public ResponseEntity<SimpleResponseDTO> updateStoreByNameAndSeller(@RequestBody StoreDTO storeDTO) {
        logger.info("Controller Layer - updateStoreByNameAndSeller: Updating store by name and seller without image...");
        SimpleResponseDTO response = storeService.updateStoreByNameAndSeller(storeDTO);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - updateStoreByNameAndSeller: Store updated successfully");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - updateStoreByNameAndSeller: Failed to update store");
        return ResponseEntity.status(500).body(null);
    }

    @PutMapping(value = "/update", consumes = "multipart/form-data")
    public ResponseEntity<SimpleResponseDTO> updateStoreByNameAndSeller(@RequestPart("image") MultipartFile image,
                                                                        @RequestPart("json") StoreDTO storeDTO) {
        logger.info("Controller Layer - updateStoreByNameAndSeller: Updating store by name and seller with image...");
        SimpleResponseDTO response = storeService.updateStoreByNameAndSeller(storeDTO, image);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - updateStoreByNameAndSeller: Store updated successfully");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - updateStoreByNameAndSeller: Failed to update store");
        return ResponseEntity.status(500).body(null);
    }

    @PutMapping(value = "/update/id", consumes = "application/json")
    public ResponseEntity<SimpleResponseDTO> updateStoreById(@RequestBody StoreDTO storeDTO) {
        logger.info("Controller Layer - updateStoreById: Updating store by ID without image...");
        SimpleResponseDTO response = storeService.updateStoreById(storeDTO);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - updateStoreById: Store updated successfully");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - updateStoreById: Failed to update store");
        return ResponseEntity.status(500).body(null);
    }

    @PutMapping(value = "/update/id", consumes = "multipart/form-data")
    public ResponseEntity<SimpleResponseDTO> updateStoreById(@RequestPart("image") MultipartFile image,
                                                             @RequestPart("json") StoreDTO storeDTO) {
        logger.info("Controller Layer - updateStoreById: Updating store by ID with image...");
        SimpleResponseDTO response = storeService.updateStoreById(storeDTO, image);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - updateStoreById: Store updated successfully");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - updateStoreById: Failed to update store");
        return ResponseEntity.status(500).body(null);
    }

    @DeleteMapping(value = "/delete/id/{storeId}")
    public ResponseEntity<SimpleResponseDTO> deleteStore(@PathVariable Long storeId) {
        logger.info("Controller Layer - deleteStore: Deleting store by ID...");
        SimpleResponseDTO response = storeService.deleteStore(storeId);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - deleteStore: Store deleted successfully");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - deleteStore: Failed to delete store");
        return ResponseEntity.status(500).body(null);
    }

    @DeleteMapping(value = "/delete/{storeId}/{productId}")
    public ResponseEntity<SimpleResponseDTO> deleteProduct(@PathVariable Long storeId,
                                                           @PathVariable Long productId){
        logger.info("Controller Layer - deleteProduct: Deleting product by ID and store ID...");
        SimpleResponseDTO response = storeService.deleteProduct(storeId, productId);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - deleteProduct: Product deleted successfully");
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - deleteProduct: Failed to delete product");
        return ResponseEntity.status(500).body(null);
    }
}