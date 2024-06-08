import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { message, Select } from "antd";
import BottomNav from "../components/BottomNav";
import "../components/Button.css";
import EventButton from "../components/EventButton";
import Header from "../components/Header";
import ImageSlider from "../components/ImageSlider";
import { fetchRefreshToken } from "../utils/authUtil";

export default function Item() {
  const { id } = useParams();

  const email = sessionStorage.getItem("email");
  let token = sessionStorage.getItem("token");
  const CART_URL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_DJANGO_CART_URL
      : process.env.REACT_APP_API_URL;
  const [targetColor, setTargetColor] = useState(); //선택한 색상
  const [targetSize, setTargetSize] = useState(); //선택한 사이즈
  const [quantity, setQuantity] = useState(1); // 수량
  const [price, setPrice] = useState(0); // 제품 하나의 가격
  const perPrice = parseInt(price) * quantity; // 제품 당 가격

  const [colorArray, setColorArray] = useState([]); //색상 배열 [
  const [sizeArrayForColor, setSizeArrayForColor] = useState([]); //선택한 색상에 따른 사이즈 배열
  const [result, setResult] = useState(null); // 옵션 가져오기 결과

  const [stock, setStock] = useState(0); // 재고

  function clickPurchase(e) {
    if (email === null) {
      navigate("/login");
    } else {
      console.log("구매");
      const payload = [
        {
          user_email: email,
          store_id: result.storeId,
          product: {
            p_image: result.productUrls[0].url,
            p_id: result.productId,
            p_name: result.productName,
            size: targetSize,
            color: targetColor,
            quantity: quantity,
            price: perPrice,
          },
        },
      ];

      navigate("/user/purchase", { state: { selectedItems: payload } });
    }
  }

  async function clickAddCart(tryAgain = true) {
    // Create payload
    const payload = {
      user_email: email,
      store_id: result.storeId,
      product: {
        p_image: result.productUrls[0].url,
        p_id: result.productId,
        p_name: result.productName,
        size: targetSize,
        color: targetColor,
        quantity: quantity,
        price: perPrice,
      },
    };

    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === "development" ? "" : ""
        }${CART_URL}cart/items/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 401) {
        const RefreshToken = sessionStorage.getItem("RefreshToken");
        fetchRefreshToken(RefreshToken);
        token = sessionStorage.getItem("token");
      }

      if (response.status === 201) {
        console.log("성공!");

        message.success("장바구니에 성공적으로 담겼습니다.");
      } else if (response.status === 400) {
        message.error("장바구니에 담기지 않았습니다. 재시도 해주세요");
        // Handle error
      }
    } catch (error) {
      console.error("오류 발생:", error);
      message.error("오류가 발생했습니다. 재시도 해주세요");
    }
  }

  const navigate = useNavigate();

  const handleAddCart = () => {
    // 유저버튼 클릭 시 로그인 상태 체크 후 라우팅 진행.
    if (email === null) {
      navigate("/login");
    }
  };

  function quantityPlus() {
    //수량 증가
    setQuantity(quantity + 1);
  }
  function quantityMinus() {
    //수량 감소
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  useEffect(() => {
    if (result) {
      const targetOption = result.options.find(
        (option) =>
          option.productColor === targetColor &&
          option.productSize === targetSize
      );
      if (targetOption) {
        setStock(targetOption.productStock);
      }
    }
  }, [targetColor, targetSize, result]);

  useEffect(() => {
    if (result) {
      // 색상이 변경되었을 때, 사이즈 배열 업데이트

      const newSizeArray = result.options.reduce((acc, current) => {
        if (
          current.productColor === targetColor &&
          !acc.includes(current.productSize)
        ) {
          acc.push(current.productSize);
        }
        return acc;
      }, []);

      setSizeArrayForColor(newSizeArray);
      setTargetSize(newSizeArray[0]);
      setPrice(result.options[0].productPrice);
    }
  }, [result, targetColor]);

  const handleColorChange = (value) => {
    // 선택한 색상 변경
    // const newTargetColor = e.target.value;
    // setTargetColor(color => (color = newTargetColor));
    setTargetColor(value);
    console.log("Color changed to: " + value);
  };

  const handleSizeChange = (value) => {
    // 선택한 사이즈 변경
    // setTargetSize((size) => (size = e.target.value));
    setTargetSize(value);
    console.log("Size changed to: " + value);
  };

  useEffect(() => {
    async function optionGet() {
      //옵션 가져오기
      console.log("가져온 상품아이디", id);
      const response = await fetch(
        `${process.env.NODE_ENV === "development" ? "" : ""}${
          process.env.REACT_APP_API_URL
        }product/all/` + id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      const resultData = await response.json();

      if (response.status === 200) {
        console.log("성공");
        console.log(resultData);
        setResult(resultData); // 상태 업데이트

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
        setStock(resultData.options[0].productStock); // 초기 재고 설정

        console.log("색깔" + colorArray);

        // 색상이 변경되었을 때, 사이즈 배열 업데이트
        const newSizeArray = resultData.options.reduce((acc, current) => {
          if (
            current.productColor === targetColor &&
            !acc.includes(current.productSize)
          ) {
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

  // productUrls에서 url만 추출하여 이미지 배열 생성
  const imageUrls = result?.productUrls?.map((item) => item.url) || [];

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
              {/* <ImageSlider images={result.productUrls}></ImageSlider> */}
              {imageUrls.length > 0 && <ImageSlider images={imageUrls} />}
            </div>
            <div style={{ marginTop:"1rem", textAlign: "left", fontSize :"20px", marginLeft:"1rem"}}>{result.productName}</div>
            <div style={{display: "flex", justifyContent:"space-between", alignItems:"center"}}>
            <div style={{ textAlign: "left", marginLeft:"1rem" }}>
              <span style={{fontSize :"35px"}}>{parseInt(price).toLocaleString()}</span>
              <span style={{fontSize :"15px"}}>원</span>
            </div>
            <span style={{textAlign: "right", marginRight:"1.3rem", fontSize:"17px"}}>재고: {stock}</span>
            </div>
            {/* <p>상세 정보: {"없음"}</p> */}
            {/* <h3>재고: {stock}</h3> */}
            <div style={{marginTop:"1.5rem"}}>
            <span style={{ fontSize: "15px", marginRight:"0.6rem" }}>색상 </span>
              <Select
                style={{ marginLeft: "1rem", fontSize: "1rem" ,textAlignLast: "center", width:"18.5rem" }}
                value={targetColor}
                onChange={handleColorChange}
              >
                {colorArray.map((color, index) => (
                  <option value={color} key={index}>
                    {color}
                  </option>
                ))}
              </Select>
            </div>
            <div style={{marginTop:"0.5rem"}}>
            <span style={{fontSize: "15px" }}>사이즈</span>
              <Select
                style={{
                  marginLeft: "1rem",
                  width: "18.5rem",
                  textAlignLast: "center",
                  fontSize: "1rem",
                }}
                value={targetSize}
                onChange={handleSizeChange}
              >
                {sizeArrayForColor.map((size, index) => (
                  <option value={size} key={index}>
                    {size}
                  </option>
                ))}
              </Select>
            </div>
            <div
              className="quantityWrapper"
              style={{ justifyContent: "center", marginTop:"1rem" }}
            >
              <button className="quantityButton" onClick={quantityMinus}>
                {" "}
                -{" "}
              </button>
              <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                {quantity}
              </span>
              <button className="quantityButton" onClick={quantityPlus}>
                {" "}
                +{" "}
              </button>
            </div>
            
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: "1.5rem",
          // marginBottom: "3rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <div onClick={handleAddCart}>
          <EventButton buttonText="장바구니" onClick={clickAddCart} />
        </div>

        <div>
          <EventButton buttonText="구매하기" onClick={clickPurchase} />
        </div>
      </div>
      <br/>
      <br/>
      <BottomNav />
    </div>
  );
}
