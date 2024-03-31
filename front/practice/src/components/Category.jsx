import React, { useState } from "react";
import CardList from "./CardList";
import "./Category.css";

import belt from "../adImages/categoryIconImage/belt.png";
import bottom from "../adImages/categoryIconImage/bottom.png";
import etc from "../adImages/categoryIconImage/etc.png";
import outer from "../adImages/categoryIconImage/outer.png";
import shoes from "../adImages/categoryIconImage/shoes.png";
import top from "../adImages/categoryIconImage/top.png";

const Category = ({ allUrl, categoryUrl }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    console.log(category);
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
            <img src={top} style={{ width: "40px", height: "40px" }} />
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>상의</span>
            {/* <FaTshirt size={20} /> <br /> 상의 */}
          </div>
          <div
            className="category-item"
            onClick={() => handleCategoryClick("하의")}
          >
            <img src={bottom} style={{ width: "40px", height: "40px" }} />
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>하의</span>
            {/* <PiPantsFill size={20} /> <br /> 하의 */}
          </div>
          <div
            className="category-item"
            onClick={() => handleCategoryClick("아우터")}
          >
            <img src={outer} style={{ width: "40px", height: "40px" }} />
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>아우터</span>
            {/* <GiPirateCoat size={20} /> <br /> 아우터 */}
          </div>
        </div>
        <div className="category-row">
          <div
            className="category-item"
            onClick={() => handleCategoryClick("신발")}
          >
            <img src={shoes} style={{ width: "40px", height: "40px" }} />
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>신발</span>
            {/* <GiConverseShoe size={20} /> <br /> 신발 */}
          </div>
          <div
            className="category-item"
            onClick={() => handleCategoryClick("잡화")}
          >
            <img src={belt} style={{ width: "40px", height: "40px" }} />
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>잡화</span>
            {/* <GiBelt size={20} /> <br /> 잡화 */}
          </div>
          <div
            className="category-item"
            onClick={() => handleCategoryClick("기타")}
          >
            <img src={etc} style={{ width: "40px", height: "40px" }} />
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>기타</span>
            {/* <FiMoreHorizontal size={20} /> <br /> 기타 */}
          </div>
        </div>
      </div>

      {/* 선택된 카테고리가 없을 때 보여줄 추천 상품 */}
      {!selectedCategory && (
        <CardList category={selectedCategory} url={`${allUrl}`} />
      )}
      {/* 선택된 카테고리에 따라 다른 CardList를 보여줍니다. */}
      {selectedCategory && (
        <CardList
          category={selectedCategory}
          url={`${categoryUrl}${selectedCategory}`}
        />
      )}
    </div>
  );
};

export default Category;
