import { Link } from "react-router-dom";
import Data from "../DB/Data.json";
import Card from "../components/Card"; // Card 컴포넌트 임포트
import EventButton from "../components/EventButton";

export default function Cart() {
  const CardInCart = Data.cardData.filter(
    (card) => card.isCartItems === Boolean(true)
  );

  return (
    <div className="cart">
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

      <EventButton buttonText={"구매하기"} />
    </div>
  );
}
