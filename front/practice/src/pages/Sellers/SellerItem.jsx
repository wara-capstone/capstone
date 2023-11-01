import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "./Seller.css";

const SellerItem = ({ item }) => {
  const [name, setName] = useState(item?.name || "");
  const [price, setPrice] = useState(item?.price || "");
  const [content, setContent] = useState(item?.content || "");
  const [count, setCount] = useState(item?.count || "");

  const [image, setImage] = useState();
  const [previewImageSrc, setPreviewImageSrc] = useState(
    item?.profileImage || "https://via.placeholder.com/150x150"
  );

  // form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement the code to send updated data to the server
    console.log({ name, price, content, count, image });
  };

  // image change handler
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreviewImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="seller-item">
      <form onSubmit={handleSubmit}>
        <div className="item-edit-info-container">
          <label>상품 사진</label>
          <div className="item-edit-image">
            <label className="item-edit-icon">
              <FontAwesomeIcon icon={faPlus} />
              <input
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
            <img src={previewImageSrc} alt="상품사진" />
          </div>
          <label>상품 이름</label>
          <div className="item-edit-name">
            <input
              type="text"
              value={name}
              placeholder="상품이름 입력"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <label>상품 가격</label>
          <div className="item-edit-price">
            <input
              type="text"
              value={price}
              placeholder="상품가격 입력"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <label>상품 정보</label>
          <div className="item-edit-content">
            <input
              type="text"
              value={content}
              placeholder="상품정보 입력"
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <label>상품 재고</label>
          <div className="item-edit-count">
            <input
              type="text"
              value={count}
              placeholder="상품재고 입력"
              onChange={(e) => setCount(e.target.value)}
            />
          </div>
          {/* submit button */}
          {/* <EventButton buttonText={"저장하기"} /> */}
          <button className="item-save-button">저장하기</button>
        </div>
      </form>
    </div>
  );
};

export default SellerItem;
