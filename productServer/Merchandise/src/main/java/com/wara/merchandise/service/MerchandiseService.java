package com.wara.merchandise.service;


import com.wara.merchandise.dao.MerchandiseDAO;
import com.wara.merchandise.dao.MerchandiseDAOImpl;
import com.wara.merchandise.dto.MerchandiseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MerchandiseService {


    //TODO: 메서드 명명 통일할 것


    private final MerchandiseDAO dao;

    public MerchandiseService(@Autowired MerchandiseDAO dao) {
        this.dao = dao;
    }

    /**
     * @param dto
     * controller 로 부터 전달받아 valid검사 후 DB등록
     */
    public void create(MerchandiseDTO dto)
    {
        dao.initProduct(dto.dtoToEntity());
    }


    public void update(MerchandiseDTO dto)
    {

    }

    public MerchandiseDTO read(String id)
    {
        return dao.readProduct(id).entityToDto();
    }

    public List<MerchandiseDTO> readAll()
    {
        List<MerchandiseDTO> dtoList = new ArrayList<>();

        for(var item: dao.readAll())
        {
            dtoList.add(item.entityToDto());
        }

        return dtoList;
    }

    public List<MerchandiseDTO> readcondition(String condition)
    {
        List<MerchandiseDTO> dtoList = new ArrayList<>();

        for(var item: dao.readProductList(condition))
        {
            dtoList.add(item.entityToDto());
        }

        return dtoList;
    }

    public void delete(String id)
    {
        dao.delete(id);
    }


}
