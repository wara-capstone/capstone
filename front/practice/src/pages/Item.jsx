import React , { useEffect, useState }from "react";
import { useNavigate, useParams } from "react-router-dom";

import Data from "../DB/Data.json";
import AddToCartButton from "../components/AddToCartButton";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import ImageSlider from "../components/ImageSlider";
import "../components/Button.css"
import EventButton from "../components/EventButton";

export default function Item() {
  const { id } = useParams();
  // const selectedCard = Data.cardData.filter((card) => card.id === Number(id));

  const email = sessionStorage.getItem("email");
  const token = sessionStorage.getItem("token");

  const [targetColor, setTargetColor] = useState(); //선택한 색상
  const [targetSize, setTargetSize] = useState(); //선택한 사이즈
  const [quantity, setQuantity] = useState(1); // 수량
  const [price, setPrice] = useState(0); // 제품 하나의 가격
  const perPrice = parseInt (price) * quantity; ; // 제품 당 가격

  const [colorArray, setColorArray] = useState([]); //색상 배열 [
  const [sizeArrayForColor, setSizeArrayForColor] = useState([]); //선택한 색상에 따른 사이즈 배열
  const [result, setResult] = useState(null); // 옵션 가져오기 결과

  function clickPurchase(e) {
    if (email === null) {
      navigate("/login");
    }
    else{
    console.log("구매");
    const payload =[ {
      user_email: email,
      store_id: result.storeId,
      product:{
          p_id: result.productId,
          p_name: result.productName,
          size: targetSize,
          color: targetColor,
          quantity:quantity,
          price: perPrice,
      }
    }];

    navigate("/user/purchase", 
    { state: {selectedItems: payload} } 
    );
    }
}

async function clickAddCart(e) {
   // Create payload
   const payload = {
    user_email: email,
    store_id: result.storeId,
    product:{
        p_id: result.productId,
        p_name: result.productName,
        size: targetSize,
        color: targetColor,
        quantity:quantity,
        price: perPrice,
    }
  };

  try {
    const response = await fetch(
      "http://3.34.227.3:16000/cart/items/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        },
        body: JSON.stringify(payload),
      }
    );
    console.log(payload);
    if (response.status === 200) {
      console.log("성공!");
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

  const navigate = useNavigate();

  const handleAddCart = () => {
    // 유저버튼 클릭 시 로그인 상태 체크 후 라우팅 진행.
    if (email === null) {
      navigate("/login");
    }
  };

  function quantityPlus() {  //수량 증가
    setQuantity (quantity + 1);
}
function quantityMinus () { //수량 감소
    if (quantity > 1) {
        setQuantity (quantity - 1);
    }
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
  setPrice(result.options[0].productPrice);
}
}, [result, targetColor]);





const handleColorChange = (e) => { // 선택한 색상 변경
  const newTargetColor = e.target.value;
  setTargetColor(newTargetColor);
  console.log("Color changed to: " + e.target.value);
}

const handleSizeChange = (e) => { // 선택한 사이즈 변경
  setTargetSize(e.target.value);
  console.log("Size changed to: " + e.target.value);
}


useEffect(() => {
  async function optionGet() { //옵션 가져오기
    const response = await fetch(
        'https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/product/all/'+47,
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
      setTargetColor(newColorArray[0]); // 초기 색상 설정
      setPrice(resultData.options[0].productPrice); // 초기 가격 설정

      console.log("색깔"+colorArray);
 
         // 색상이 변경되었을 때, 사이즈 배열 업데이트
    const newSizeArray = resultData.options.reduce((acc, current) => {
        if (current.productColor === targetColor && !acc.includes(current.productSize)) {
            acc.push(current.productSize);
        }
        return acc;
        }, []);
        setSizeArrayForColor(newSizeArray);
        setTargetSize(newSizeArray[0]); // 초기 사이즈 설정
        

      } else {
       console.log(response);
        console.log("실패");
      }
}

optionGet();
}, []);


  return (
    <div className="item">
      <Header />
        <div key={result && result.productId}>
          {/* <div className="item-image-container">
            <img src={card.image1} alt={card.title} className="item-image" />         
          </div> */}
          {result && (
            <div>
              <div>
              <ImageSlider images={result.productUrls}></ImageSlider>
              </div>
              <h3>{result.productName}</h3>
              <p>가격: {price}</p>
              {/* <p>상세 정보: {"없음"}</p> */}
              <p>재고: {result.options[0].productStock}</p>
        <div>색상
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
        <div className="quantityWrapper" style={{justifyContent:"center"}}>
        개수
        <button className="quantityButton" onClick={quantityMinus}> - </button> 
             <h5>{quantity}</h5>
        <button className="quantityButton" onClick={quantityPlus}> + </button> 
        </div>
              </div>)}
        </div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
      <div onClick={handleAddCart}>
      <EventButton buttonText="장바구니 담기" onClick={clickAddCart} />
      </div>

      <div>
        <EventButton buttonText="구매하기" onClick={clickPurchase} />
      </div>
    </div>
      <BottomNav />
    </div>
  );
}
