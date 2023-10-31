import React, { useEffect, useState } from "react";
import "./ImageSlider.css";

const AdComponent = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, images]);

  return (
    <div className="ad-image-container">
      <div className="slider-image-container">
        <img
          key={images[currentIndex].id}
          src={images[currentIndex].src}
          alt={`Ad ${images[currentIndex].id}`}
          className="ad-image"
        />
        <div className="slider-image-index">
          {Array.from({ length: images.length }, (_, i) => (
            <div
              key={images[i].id}
              className={`slider-circle ${i === currentIndex ? "active" : ""}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdComponent;
