import React, { useEffect, useState } from 'react';
import '../components/OrderProducts.css';

export default function PurchaseHistoryCard({data}) {

    // const [quantity, setQuantity] = useState(selectedBread.product.quantity); //수량
    // const perPrice = parseInt (selectedBread.product.price); // Product당 가격 * 개수 값
return (
    <div className="orderProductList" style={{height:"7.5rem"}}> 
    <div style={{display:'flex',justifyContent:'space-around'}}>
     <div className="imageWrapper">
     <img src={data.productUrls[0].url} alt="bread" className="breadImage" />
    </div>
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <label style={{fontSize:"1.2rem"}}>{data.productName}</label>
        <div style={{display: 'flex', justifyContent:"center"}} >
        <span className="dayOption">{data.options[0].productColor + ", " + data.options[0].productSize}</span> 
    </div>
        <label style={{fontSize:"1.2rem"}}>{data.quantity} 개</label>
        </div>
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}} >
        <h4>{(data.price * data.quantity).toLocaleString()}원</h4> 
    </div>
        </div>
</div>
);
}