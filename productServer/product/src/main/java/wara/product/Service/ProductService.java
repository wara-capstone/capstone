package wara.product.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import wara.product.DAO.ProductDAO;
import wara.product.DTO.ProductDTO;
import wara.product.DTO.ResponseDTO;
import wara.product.productEntity.ProductEntity;

import java.util.ArrayList;
import java.util.LinkedList;
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
        try{
            return ResponseDTO.of(HttpStatus.OK, dao.readSingleProductInfo(productId).ETOD()) ; }
        catch (NullPointerException e) {
            return ResponseDTO.of(HttpStatus.BAD_REQUEST, new ProductDTO()); }
    }

    /**
     * 한 상점의 모든 상품 정보 조회
     * */
    public ResponseDTO<List<ProductDTO>> multiProductInfo(Long storeId)
    {
        try{
            List<ProductEntity> EList = dao.readMultiProductInfo(storeId);
            List<ProductDTO> DList = new ArrayList<>();
            for(var item: EList) { DList.add(item.ETOD());}
        }catch (NullPointerException e) {
            return ResponseDTO.of(HttpStatus.BAD_REQUEST, new LinkedList<>());
        }
        return ResponseDTO.of(HttpStatus.BAD_REQUEST, new LinkedList<>());
    }


    /**
     * 상품 등록에 대한 비즈니스 로직
     * @param dto
     * @return productID
     */
    public Long initProductInfo(ProductDTO dto)
    {
        return dao.initProductInfo(dto.DTOE());
    }

    /**
     * 상품정보 수정에 대한 비즈니스 로직
     * */
    public HttpStatus modifyProductInfo(ProductDTO dto)
    {
        return dao.modifyProductInfo(dto.DTOE());
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
    public HttpStatus removeMultiProduct(Long storeId)
    {
        dao.removeMultiProduct(storeId);
        return HttpStatus.OK;
    }







}
