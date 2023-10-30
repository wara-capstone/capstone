import { Link } from "react-router-dom";
import Data from "../DB/Data.json";
import Card from "../components/Card"; // Card 컴포넌트 임포트

export default function Map() {
  const SelectedStore = Data.storeDate.filter(
    (store) => store.id === Number(1)
  );

  return (
    <div className="map">
      <h1>Map</h1>
      <div className="map-store-data">
        {SelectedStore.map((store) => (
          <Link to={`/store/${store.id}`} key={store.id} className="card-link">
            <Card
              key={store.id}
              title={store.title}
              subTitle={store.subTitle}
              content={store.content}
              mainImage={store.images[0].image}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
