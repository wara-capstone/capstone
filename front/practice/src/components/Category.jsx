import React, { useState } from "react";
import { FaTshirt } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { GiBelt, GiConverseShoe, GiPirateCoat } from "react-icons/gi";
import { PiPantsFill } from "react-icons/pi";
import CardList from "./CardList";
import "./Category.css";

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="category-container-include-items">
      <div className="category-container">
        <div className="category-row">
          <div
            className="category-item"
            onClick={() => handleCategoryClick("상의")}
          >
            <FaTshirt size={20} /> <br /> 상의
          </div>
          <div
            className="category-item"
            onClick={() => handleCategoryClick("하의")}
          >
            <PiPantsFill size={20} /> <br /> 하의
          </div>
          <div
            className="category-item"
            onClick={() => handleCategoryClick("아우터")}
          >
            <GiPirateCoat size={20} /> <br /> 아우터
          </div>
        </div>
        <div
          className="category-row"
          onClick={() => handleCategoryClick("신발")}
        >
          <div className="category-item">
            <GiConverseShoe size={20} /> <br /> 신발
          </div>
          <div
            className="category-item"
            onClick={() => handleCategoryClick("잡화")}
          >
            <GiBelt size={20} /> <br /> 잡화
          </div>
          <div
            className="category-item"
            onClick={() => handleCategoryClick("기타")}
          >
            <FiMoreHorizontal size={20} /> <br /> 기타
          </div>
        </div>
      </div>

      {/* 선택된 카테고리가 없을 때 보여줄 추천 상품 */}
      {false && <CardList category={null} />}
      {/* 선택된 카테고리에 따라 다른 CardList를 보여줍니다. */}
      {selectedCategory && <CardList category={selectedCategory} />}
    </div>
  );
};

export default Category;
