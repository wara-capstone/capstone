import React from "react";
import "./Card.css";

function Card({
  title,
  subTitle,
  content,
  content2,
  mainImage,
  id,
  price,
  count,
}) {
  return (
    <div className="card">
      <div className="card-image-container">
        <img src={mainImage} alt={title} className="card-image" />
      </div>
      <div>
        {/* <div style={{ display: "flex", alignItems: "center" }}> */}
        <h1 className="card-title">{title}</h1>
        <span className="card-sub-title">{subTitle}</span>
        {/* </div> */}
        <p className="card-content">{content}</p>
        <p className="card-content2"> {content2}</p>
        <p className="card-price">
          {price ? "가격: " : null}
          {price} {price ? "₩" : null}
        </p>
        <p className="card-count">
          {count ? "재고: " : null} {count}
        </p>
      </div>
    </div>
  );
}

export default Card;
