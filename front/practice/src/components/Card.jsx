import React from "react";
import "./Card.css";
import { Link } from "react-router-dom";

function Card({ title, subTitle, content, content2, mainImage, id }) {
  return (
    <div className="card">
      <div className="card-image-container" >
        <img src={mainImage} alt={title} className="card-image" />
      </div>
      <div>
        <h1 className="card-title">
          {title}
          </h1>
          <span className="card-sub-title">{subTitle}</span>
        <p className="card-content">{content}</p>
        <p className="card-content2">
          {content2 ? "count: " : null} {content2}
        </p>
      </div>
    </div>
  );
}

export default Card;
