import React from "react";
import "./Card.css";
import { Link } from "react-router-dom";

function Card({ title, subTitle, content, content2,content3, mainImage, id }) {
  return (
    <div className="card">
      <div className="card-image-container">
        <img src={mainImage} alt={title} className="card-image" />
      </div>
      <div>
        <h1 className="card-title">
          {title}
          <span className="card-sub-title">{subTitle}</span>
        </h1>
        <p className="card-content">{content}</p>
        <p className="card-content2">
          {content2 ? "count: " : null} {content2}
        </p>
        <p className="card-content3">{content3}</p>
      </div>
    </div>
  );
}

export default Card;
