package com.wara.merchandise.controller;


import com.wara.merchandise.dto.MerchandiseDTO;
import com.wara.merchandise.service.MerchandiseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/merchandise")
public class MerchandiseController {

    private final MerchandiseService service;

    public MerchandiseController(@Autowired MerchandiseService service) {
        this.service = service;
    }

    /**
     * update를 위해 기존 정보를 불러옴
     * (변경해선 안되는 값에 대한 생각좀 해봐야함, 프론트에서 처리할것인가 아니면 백에서 처리 할 것인가)
     * */
    @PostMapping("/info-update")
    public void post(MerchandiseDTO dto){
        service.update(dto);
    }


    /**
     * 특정 id값 상품 검색
     */
    @GetMapping("/read")
    public void get(String id){
        service.read(id);
    }

    /**
     * 모든 상품 검색
     * */
    @GetMapping("/read-all")
    public void getAll(){
        service.readAll();
    }

    /**
     * 특정 카테고리 혹은 조건에 의한 검색
     * */
    @GetMapping("/read-condition")
    public void getCondition(String condition){
        service.readcondition(condition);
    }


    @PutMapping("/init")
    public void put(MerchandiseDTO dto){
        service.create(dto);
    }

    @DeleteMapping("/remove")
    public void delete(String id){
        service.delete(id);
    }



}
