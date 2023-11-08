import React, { useState } from 'react';
import '../components/OrderProducts.css';

export default function OrderProducts({ selectedBread, changeSingleBox, data, checkList }) {

    const [quantity, setQuantity] = useState(selectedBread.number); //수량
    const perPrice = parseInt (selectedBread.order_price) / selectedBread. number;

function quantityPlus() {  //수량 증가
    setQuantity (quantity + 1);
}
function quantityMinus () { //수량 감소
    if (quantity > 1) {
        setQuantity (quantity - 1);
    } else {
        alert ('최소 1개 이상 주문이 가능합니다');
    }

}
return (
    <div className="orderProductList"> 
    <div style={{display: 'flex', height:'3vh'}}>
        <input  
        type="checkbox"
        onChange={event => changeSingleBox(event.target.checked, data.id)} 
        checked={checkList.includes (data.id) ? true : false}
    />
    <label>{selectedBread.title}</label>
    </div>

    <div style={{display:'flex',justifyContent:'space-around'}}>
     <div className="imageWrapper">
     <img src={"https://via.placeholder.com/150x150"} alt="bread" className="breadImage" />
    </div>
    <div className="optionWrapper">
        <span className="dayOption">{selectedBread.option + ", " + selectedBread.size}</span> 
        <button className="changeOption">옵션변경</button>
        <div className="quantityWrapper">
        <button className="quantityButton" onClick={quantityMinus}> - </button> 
             <h5>{quantity}</h5>
        <button className="quantityButton" onClick={quantityPlus}> + </button> 
        </div>
    </div> 
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}} >
        <label>{perPrice * quantity}원</label> 
        {/* <div className='buttonWrapper'>
            <button className="button">결제</button>
            <button className="button">삭제</button> 
        </div> */}
    </div>
        </div>
</div>
);
}