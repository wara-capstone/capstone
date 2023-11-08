import React, { useState } from 'react';
import '../components/OrderProducts.css';

export default function PurchaseProduct({ selectedBread, changeSingleBox, data, checkList }) {

    const [quantity, setQuantity] = useState(selectedBread.number); //수량
    const perPrice = parseInt (selectedBread.order_price) / selectedBread. number;

return (
    <div className="orderProductList"> 
    <div style={{display: 'flex', height:'3vh'}}>
    <label>{selectedBread.title}</label>
    </div>

    <div style={{display:'flex',justifyContent:'space-around'}}>
     <div className="imageWrapper">
     <img src={"https://via.placeholder.com/150x150"} alt="bread" className="breadImage" />
    </div>
        <span className="dayOption">{selectedBread.option + ", " + selectedBread.size}</span> 
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}} >
        <label>{perPrice * quantity}원</label> 
    </div>
        </div>
</div>
);
}