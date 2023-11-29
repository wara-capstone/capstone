import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "./ImageSlider.css";

const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);

  const nextImage = () => {
    if (index < images.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  };

  const prevImage = () => {
    if (index > 0) {
      setIndex(index - 1);
    } else {
      setIndex(images.length - 1);
    }
  };

  return (
    <div className="slider">
      <div className="slider-image-container">
        <img
          key={index}
          className="slider-image"
          src={images[index]}
          alt="슬라이드 이미지"
        />
        {images.length > 1 && (
          <>
            <div className="slider-button-container">
              <button className="slider-button prev" onClick={prevImage}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button className="slider-button next" onClick={nextImage}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </>
        )}
        <div className="slider-image-index">
          {Array.from({ length: images.length }, (_, i) => (
            <div
              key={images[i].id}
              className={`slider-circle ${i === index ? "active" : ""}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
