package com.store.Controller;
import com.store.DTO.ResponseDTO;
import com.store.DTO.StoreDTO;
import com.store.Service.StoreService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/store")
public class Controller {
    private final StoreService storeService;
    private final static Logger logger = LoggerFactory.getLogger(Controller.class);

    public Controller(@Autowired StoreService storeService) {
        this.storeService = storeService;
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseDTO> createStore(@RequestBody StoreDTO storeDTO){
        logger.info("\n[Request] : CreateStore\n[Data]: " + storeDTO.toString());
        ResponseDTO response = storeService.createStore(storeDTO);
        logger.info("\n[Response] : CreateStore\n[Data]: " + response.toString());
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("read/{storeId}")
    public ResponseEntity<ResponseDTO> readStore(@PathVariable Long storeId){
        logger.info("\n[Request] : ReadStore\n[Data]: " + storeId);
        ResponseDTO response = storeService.readStore(storeId);
        return ResponseEntity.status(200).body(response);
    }

    @DeleteMapping("/delete/{storeId}")
    public ResponseEntity<ResponseDTO> deleteStore(@PathVariable Long storeId){
        logger.info("\n[Request] : DeleteStore\n[Data]: " + storeId);
        ResponseDTO response = storeService.deleteStore(storeId);
        return ResponseEntity.status(200).body(response);
    }
}