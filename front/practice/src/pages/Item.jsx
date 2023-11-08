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

  const selectedCard = Data.cardData.filter((card) => card.id === Number(id));

  const userId = sessionStorage.getItem("email");
  const userRole = sessionStorage.getItem("role");
  const storeId = sessionStorage.getItem("storeid");
  const token = sessionStorage.getItem("token");

  function clickPurchase(e) {
    if (userId === null) {
      navigate("/login");
    }
    else{
    console.log("구매");
     navigate("/user/purchase");
    }
}


  const navigate = useNavigate();

  const handleAddCart = () => {
    // 유저버튼 클릭 시 로그인 상태 체크 후 라우팅 진행.
    if (userId === null) {
      navigate("/login");
    }
  };



  return (
    <div className="item">
      <Header />
      {selectedCard.map((card) => (
        <div key={card.id}>
          <div className="item-image-container">
            {/* <img src={card.image1} alt={card.title} className="item-image" /> */}
            <ImageSlider images={card.images}></ImageSlider>
          </div>
          <h1>{card.title}</h1>
          <p>가격: {card.subTitle}</p>
          <p>상세 정보: {card.content}</p>
          <p>재고: {card.content2}</p>
        </div>
      ))}
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
      <div onClick={handleAddCart}>
        <AddToCartButton selectedCard={selectedCard} key={selectedCard.id} />
      </div>

      <div>
        <EventButton buttonText="구매하기" onClick={clickPurchase} />
      </div>
    </div>
      <BottomNav />
    </div>
  );
}
