package wara.product.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;
import wara.product.DAO.ProductDAO;
import wara.product.DTO.ProductDTO;
import wara.product.productEntity.ProductEntity;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class ProductService {

    private final ProductDAO dao;

    public ProductService(@Autowired ProductDAO dao) {
        this.dao = dao;
    }


    /**
     * 단일값 요청에 대한 비즈니스 로직
     */
    public ProductDTO singleProductInfo(ProductDTO dto){
        return dao.readSingleData(dto.DTOE()).ETOD();
    }

    /**
     * 카테고리 기준 다중 값 요청에 대한 비즈니스 로직
     * */
    // TODO: 현재는 카테고리를 기준으로 작성했음, 추후에 매개변수에 따른 분리가 필요
    public List<ProductDTO> multiProductInfo(ProductDTO dto)
    {
        List<ProductEntity> EList = dao.readMultiData(dto.DTOE());
        List<ProductDTO> DList = new ArrayList<>();
        for(var item: EList)
        {
            DList.add(item.ETOD());
        }

        return DList;
    }




    /**
     * 상품 등록에 대한 비즈니스 로직
     * */
    public HttpStatus initProductInfo(ProductDTO dto)
    {

        return HttpStatus.OK;
    }

    /**
     * 상품정보 수정에 대한 비즈니스 로직
     * */
    public HttpStatus modifyProductInfo(ProductDTO dto)
    {

        return HttpStatus.OK;
    }


    /**
     * 상품정보 삭제에 대한 비즈니스 로직
     * */
    public HttpStatus removeProduct(ProductDTO dto)
    {

        return HttpStatus.OK;
    }







}
