import { Link } from "react-router-dom";
import Data from "../DB/Data.json";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card"; // Card 컴포넌트 임포트
import EventButton from "../components/EventButton";
import Header from "../components/Header";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const CardInCart = Data.cardData.filter(
    (card) => card.isCartItems === Boolean(true)
  );

  let navigate = useNavigate();


  function asd(e) {
      console.log("구매");
       navigate("/user/purchase");
  }

    useEffect(() => {
    }
    , []);




  return (
    <div className="cart-page">
      <Header />
      {CardInCart.map((card) => (
        <Link to={`/item/${card.id}`} key={card.id} className="card-link">
          <Card
            key={card.id}
            title={card.title}
            subTitle={card.subTitle}
            content={card.content}
            content2={card.content2}
            mainImage={card.images[0].image}
          />
        </Link>
      ))}

      <EventButton buttonText={"구매하기"} onClick={asd}/>
      <BottomNav />
    </div>
  );
}
