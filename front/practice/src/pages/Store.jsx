import React from "react";
import { Link, useParams } from "react-router-dom";
import Data from "../DB/Data.json";
import EventButton from "../components/EventButton";

export default function Store() {
  const { id } = useParams();
  const selectedStore = Data.storeDate.filter(
    (store) => store.id === Number(id)
  );

  return (
    <div className="store">
      {selectedStore.map((store) => (
        <div key={store.id}>
          <div className="item-image-container">
            <img
              src={store.images[0].image}
              alt={store.title}
              className="item-image"
            />
          </div>
          <h1>{store.title}</h1>
          <p>store location: {store.subTitle}</p>
          <p>store detail: {store.content}</p>
        </div>
      ))}
      <Link to={"/chatting"} className="button-link">
        <EventButton buttonText={"1대1 상담"} />
      </Link>
    </div>
  );
}
