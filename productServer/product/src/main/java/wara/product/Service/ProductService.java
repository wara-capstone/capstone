package wara.product.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import wara.product.DAO.ProductDAO;
import wara.product.DTO.ProductDTO;
import wara.product.DTO.ResponseDTO;
import wara.product.productEntity.ProductEntity;

import java.util.ArrayList;
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
    public ResponseDTO<ProductDTO> singleProductInfo(Long productId){
        if(productId == null) return ResponseDTO.of(HttpStatus.OK,"a", new ProductDTO());
        return ResponseDTO.of(HttpStatus.OK, "a", dao.readSingleProductInfo(productId).ETOD());
    }

    /**
     * 카테고리 기준 다중 값 요청에 대한 비즈니스 로직
     * */
    // TODO: 현재는 storeId를 기준으로 작성했음, 추후에 매개변수에 따른 분리가 필요
    public ResponseDTO<List<ProductDTO>> multiProductInfo(Long storeId)
    {
        List<ProductEntity> EList = dao.readMultiProductInfo(storeId);
        List<ProductDTO> DList = new ArrayList<>();
        for(var item: EList)
        {
            DList.add(item.ETOD());
        }

        return ResponseDTO.of(HttpStatus.OK, "a",DList);
    }




    /**
     * 상품 등록에 대한 비즈니스 로직
     * */
    public Long initProductInfo(ProductDTO dto)
    {
        return dao.initProductInfo(dto.DTOE());
    }

    /**
     * 상품정보 수정에 대한 비즈니스 로직
     * */
    public HttpStatus modifyProductInfo(ProductDTO dto)
    {
        dao.modifyProductInfo(dto.DTOE());
        return HttpStatus.OK;
    }


    /**
     * 단일 상품정보 삭제에 대한 비즈니스 로직
     * */
    public HttpStatus removeSingleProduct(Long productId)
    {
        dao.removeSingleProduct(productId);
        return HttpStatus.OK;
    }


    /**
     * 다중 상품정보 삭제에 대한 비즈니스 로직
     * */
    public HttpStatus removeMultiProduct(Long productId)
    {
        dao.removeMultiProduct(productId);
        return HttpStatus.OK;
    }







}
