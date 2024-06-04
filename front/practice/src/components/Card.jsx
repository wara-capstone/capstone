import React from "react";
import "./Card.css";

function Card({
  title,
  subTitle,
  content,
  content2,
  content3,
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
      <div className="card-content-container">
        {/* <div style={{ display: "flex", alignItems: "center" }}> */}
        <p className="card-title">{title}</p>
        <p className="card-sub-title">{subTitle}</p>
        {/* </div> */}
        <p className="card-content">{content}</p>
        <p className="card-content2"> {content2}</p>
        <p className="card-price">
          <span style={{fontSize:"1.3rem"}}>{price}</span>
          <span>{price ? "원" : null}</span>
        </p>
        {/* <p className="card-count">
          {count ? "재고: " : null} {count}
        </p> */}
        <p className="card-content3">{content3}</p>
      </div>
    </div>
  );
}

export default Card;
