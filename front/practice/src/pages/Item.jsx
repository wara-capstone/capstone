import React from "react";
import { useParams } from "react-router-dom";
import Data from "../DB/Data.json";
import AddToCartButton from "../components/AddToCartButton";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import ImageSlider from "../components/ImageSlider";

export default function Item() {
  const { id } = useParams();
  const selectedCard = Data.cardData.filter((card) => card.id === Number(id));

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
          <p>price: {card.subTitle}</p>
          <p>item detail: {card.content}</p>
          <p>count: {card.content2}</p>
        </div>
      ))}
      <AddToCartButton selectedCard={selectedCard} key={selectedCard.id} />
      <BottomNav />
    </div>
  );
}
