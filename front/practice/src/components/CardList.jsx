import React from "react";
import { Link } from "react-router-dom";
import Data from "../DB/Data.json";
import Card from "./Card"; // Card 컴포넌트 임포트
import "./Card.css";
// import { useEffect, useState } from "react";

function CardList(item) {

  return (
    <div className="card-list">
      {Data.cardData.map((card) => (
        <Link to={`/item/${card.id}`} key={card.id} className="card-link">
          <Card
            key={card.id}
            title={card.title}
            subTitle={card.subTitle}
            content={card.content}
            mainImage={card.images[0].image}
            content2={card.content2}
          />
        </Link>
      ))}
    </div>
  );
}

export default CardList;
