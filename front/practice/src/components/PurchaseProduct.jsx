import React, { useState } from 'react';
import '../components/OrderProducts.css';

export default function PurchaseProduct({ selectedBread, changeSingleBox, data, checkList, modalIsOpen }) {

    const [quantity, setQuantity] = useState(selectedBread.product.quantity); //수량
    const perPrice = parseInt (selectedBread.product.price); // Product당 가격 * 개수 값

return (
    <div className="orderProductList" style={{height:"6.2rem"}}> 
    <div style={{display:'flex',justifyContent:'space-around'}}>
     <div className="imageWrapper">
     <img src={selectedBread.product.p_image} alt="bread" className="breadImage" />
    </div>
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <label style={{fontSize:"1.2rem"}}>{selectedBread.product.p_name}</label>
        <div style={{display: 'flex', justifyContent:"center"}} >
        <span className="dayOption">{selectedBread.product.color + ", " + selectedBread.product.size}</span> 
    </div>
        <label style={{fontSize:"1.2rem"}}>{quantity}개</label>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}} >
        <label>
            <span style={{fontSize:"20px"}}>{perPrice.toLocaleString()}</span>
            <span>원</span>            
            
            </label> 
    </div>
        </div>
</div>
);
}