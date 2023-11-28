import { Link } from "react-router-dom";
import Data from "../DB/Data.json";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card"; // Card 컴포넌트 임포트
import EventButton from "../components/EventButton";
import Header from "../components/Header";
import { useEffect } from "react";

export default function Purchase() {
  const CardInCart = Data.cardData.filter(
    (card) => card.isCartItems === Boolean(true)
  );

    //
    useEffect(() => {
    }
    , []);



  return (
    <div className="cart-page">
      <Header />
      <h1>구매 페이지</h1>
       <div>총 가격: 100</div>
      <EventButton buttonText={"결제"} />
      <BottomNav />
    </div>
  );
}
