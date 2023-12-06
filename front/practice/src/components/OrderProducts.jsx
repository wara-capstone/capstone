import React, { useState, useEffect } from 'react';
import '../components/OrderProducts.css';
import Modal from 'react-modal';

export default function OrderProducts({ selectedBread, changeSingleBox, data, checkList }) {

    const [targetColor, setTargetColor] = useState(data.product.color); //선택한 색상
    const [targetSize, setTargetSize] = useState(data.product.size); //선택한 사이즈

    const [colorArray, setColorArray] = useState([]); //색상 배열 [
    const [sizeArrayForColor, setSizeArrayForColor] = useState([]); //선택한 색상에 따른 사이즈 배열

    const [quantity, setQuantity] = useState(data.product.quantity); //수량
    const perPrice = parseInt (data.product.price) / data.product.quantity; // 제품 당 가격
    const [modalIsOpen, setModalIsOpen] = useState(false); //팝업 창 열기, 닫기
    const [result, setResult] = useState(null); // 옵션 가져오기 결과


    var email = localStorage.getItem('email');
    var token = localStorage.getItem('token');
    const CART_URL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DJANGO_CART_URL : process.env.REACT_APP_API_URL;
    const handleColorChange = (e) => { // 선택한 색상 변경
        const newTargetColor = e.target.value;
        setTargetColor(newTargetColor);
        console.log("Color changed to: " + e.target.value);
    }


    useEffect(() => {
        if (result) {
         // 색상이 변경되었을 때, 사이즈 배열 업데이트
    const newSizeArray = result.options.reduce((acc, current) => {
        if (current.productColor === targetColor && !acc.includes(current.productSize)) {
            acc.push(current.productSize);
        }
        return acc;
        }, []);
        setSizeArrayForColor(newSizeArray);
        setTargetSize(newSizeArray[0]);
    }
    }, [result, targetColor]);
    
      const handleSizeChange = (e) => { // 선택한 사이즈 변경
        setTargetSize(e.target.value);
        console.log("Size changed to: " + e.target.value);
      }

      
function quantityPlus() {  //수량 증가
    setQuantity (quantity + 1);
}
function quantityMinus () { //수량 감소
    if (quantity > 1) {
        setQuantity (quantity - 1);
    }
}

async function optionGet() { //옵션 가져오기
    const response = await fetch(
        `${process.env.NODE_ENV === 'development' ? 'http://' : ''}${process.env.REACT_APP_API_URL}product/all/`+data.product.p_id,
        {
          method: "GET",
          headers: {    
            "Content-Type": "application/json",
            "Authorization": `${token}`
          },
        }
      );
      const resultData = await response.json();

      if (response.status === 200) {
        console.log("성공");
        console.log(resultData);
        setResult(resultData);  // 상태 업데이트
            // 색상 배열 추출
    const newColorArray = resultData.options.reduce((acc, current) => {
        if (!acc.includes(current.productColor)) {
          acc.push(current.productColor);
        }
        return acc;
      }, []);
      setColorArray(newColorArray);

 
         // 색상이 변경되었을 때, 사이즈 배열 업데이트
    const newSizeArray = resultData.options.reduce((acc, current) => {
        if (current.productColor === targetColor && !acc.includes(current.productSize)) {
            acc.push(current.productSize);
        }
        return acc;
        }, []);
        setSizeArrayForColor(newSizeArray);

      } else {
       console.log(response);
        console.log("실패");
      }
}


async function optionEdit(){  //옵션 변경
    // Create payload
    const payload = {
        user_email: email,
        cart_item_id: data.cart_item_id,
        cart: data.cart,
        store_id: data.store_id,
        product:{
            p_name: data.product.p_name,
            p_id: data.product.p_id,
            size: targetSize,
            color: targetColor,
            quantity:quantity,
            price: (perPrice * quantity),
        }
      };
      try {
        const response = await fetch(
          `${process.env.NODE_ENV === 'development' ? 'http://' : ''}${CART_URL}cart/items/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${token}`
            },
            body: JSON.stringify(payload),
          }
        );
        console.log(payload);
        if (response.status === 200) {
          // Redirect to login.html
          console.log("성공!");
          window.dispatchEvent(new CustomEvent('optionChanged'));
          setModalIsOpen(false);
        } else if (response.status !== 200) {
            const errorData = await response.json();
            console.log(errorData);
        }
        
        else if (response.status === 400) {
          // Handle error
          alert(`실패`);
        }
      } catch (error) {
        console.error("오류 발생:", error);
      }

}


function optionClose() { //옵션 변경 취소
    setModalIsOpen(false);
    setTargetColor(data.product.color);
    setTargetSize(data.product.size);
    setQuantity(data.product.quantity);
}


return (
    <div className="orderProductList"> 
    <div style={{display: 'flex', height:'3vh'}}>
        <input  
        type="checkbox"
        checked={checkList.includes(data.cart_item_id) ? true : false}
        onChange={(e) => changeSingleBox(e.target.checked, data.cart_item_id)}
    />
    <label>{data.product.p_name}</label>
    </div>

    <div style={{display:'flex',justifyContent:'space-around'}}>
     <div className="imageWrapper">
     <img src={data.product.p_image} alt="bread" className="breadImage" />
    </div>
    <div className="optionWrapper">
        <span className="dayOption">{data.product.color + ", " + data.product.size}</span> 
        <label>{quantity} 개</label>
        <button className="changeOption" onClick={async () => {
            await optionGet();
            setModalIsOpen(true);
        }}>옵션변경</button>   
    </div> 
    <Modal className='Modal'
        isOpen={modalIsOpen} 
        onRequestClose={()=> setModalIsOpen(false)}
        >
        옵션 변경
        <div className="quantityWrapper">
        개수
        <button className="quantityButton" style={{width:"2rem"}} onClick={quantityMinus}> - </button> 
             <h5>{quantity}</h5>
        <button className="quantityButton" style={{width:"2rem"}} onClick={quantityPlus}> + </button> 
        </div>
        <div style={{justifyContent:"space-around"}}>색상
        <select value={targetColor} onChange={handleColorChange} >
            {colorArray.map((color, index) => 
                <option value={color} key={index}>{color}</option>
        )}</select>

        </div>
        <div>사이즈
        <select value={targetSize} onChange={handleSizeChange}>
                {sizeArrayForColor.map(
                    (size, index) => 
                <option value={size} key={index}>{size}</option>
        )}</select>


        </div>
        <div style={{display:"flex"}}>
            <button className="changeOption" onClick={optionClose}>취소</button>  
            <button className="changeOption"style={{backgroundColor: "#32A4FF", color:"white"}} onClick={optionEdit}>저장</button>
         </div>
      </Modal>
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}} >
        <label>{data.product.price.toLocaleString()}원</label> 
        {/* <div className='buttonWrapper'>
            <button className="button">결제</button>
            <button className="button">삭제</button> 
        </div> */}
    </div>
        </div>
</div>
);
}