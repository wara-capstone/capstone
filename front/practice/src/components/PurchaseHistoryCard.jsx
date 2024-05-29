import React, { useEffect, useState } from 'react';
import moment from 'moment';

import '../components/OrderProducts.css';

export default function PurchaseHistoryCard({data}) {

    // const [quantity, setQuantity] = useState(selectedBread.product.quantity); //수량
    // const perPrice = parseInt (selectedBread.product.price); // Product당 가격 * 개수 값
return (
    <>
    <h3>{moment.utc(data.dateTime).format('YYYY-MM-DD')}</h3>
    {data.map((paymentDTO, index) => (
    <div className="orderProductList" style={{height:"7.5rem"}}> 
    <div style={{display:'flex',justifyContent:'space-around'}}>
     <div className="imageWrapper">
     <img src={paymentDTO.productUrls[0].url} alt="bread" className="breadImage" />
    </div>
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <label style={{fontSize:"1.2rem"}}>{paymentDTO.productName}</label>
        <div style={{display: 'flex', justifyContent:"center"}} >
        <span className="dayOption">{paymentDTO.options[0].productColor + ", " + paymentDTO.options[0].productSize}</span> 
    </div>
        <label style={{fontSize:"1.2rem"}}>{paymentDTO.quantity} 개</label>
        </div>
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}} >
        <h4>{(paymentDTO.price * paymentDTO.quantity).toLocaleString()}원</h4> 
    </div>
        </div>
</div>
   ))}
</>
);
}