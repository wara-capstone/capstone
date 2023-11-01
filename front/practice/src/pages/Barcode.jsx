import { Link } from "react-router-dom";
import Data from "../DB/Data.json";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card"; // Card 컴포넌트 임포트
import Header from "../components/Header";

export default function Barcode() {
  const SelectedItem = Data.cardData.filter((card) => card.id === Number(1));
  return (
    <div className="barcode">
      <Header />
      <h1>Barcode</h1>
      <div className="barcode-item-data">
        {SelectedItem.map((card) => (
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
      </div>
      <BottomNav />
    </div>
  );
}
