import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "./Seller.css";
import SellerHeader from "./SellerHeader";

const token = sessionStorage.getItem('token');

const SellerStoreManagement = ({ store }) => {
  const [name, setName] = useState(store?.name || "");
  const [location, setLocation] = useState(store?.location || "");
  const [content, setContent] = useState(store?.content || "");

  const [image, setImage] = useState();
  const [previewImageSrc, setPreviewImageSrc] = useState(
    store?.profileImage || "https://via.placeholder.com/150x150"
  );

  // form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement the code to send updated data to the server
    console.log({ name, location, content, image });

      var data = {
          "name": name,
          "address": location,
          "content" : content
      };
      var formData = new FormData();
      formData.append('image', image); // 이미지
      formData.append('data', new Blob([JSON.stringify(data)], { type: "application/json" }));
      console.log(formData);
      // formData에 이미지와 json을 합친
      for (let value of formData.values()) {
          if (value instanceof Blob) {
              var reader = new FileReader();
              reader.onload = function () {
                  console.log(reader.result); // Blob 내부 데이터를 콘솔에 출력
              };
              reader.readAsText(value);
          } else {
              console.log(value);
          }
      }
      fetch('https://port-0-creativefusion-jvpb2aln5qmjmz.sel5.cloudtype.app/store', {
          method: 'POST',
          headers: {
              "Authorization": `${token}`
          },
          body: formData
      })
          .then(response => {
              if (response.ok) {
                  return response.json(); // JSON 형식의 응답을 파싱
              }
              throw new Error('네트워크 응답이 실패했습니다.');
          })
          .then(data => {
              alert('성공!');
          })
          .catch(error => {
              console.error(error);
          });

  };

  // image change handler
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreviewImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="seller-store-management">
      <SellerHeader />
      <form onSubmit={handleSubmit}>
        <div className="store-edit-info-container">
          <div className="store-edit-image">
            <img src={previewImageSrc} alt="프로필 사진" />
            <label className="store-edit-icon">
              <FontAwesomeIcon icon={faPlus} />
              <input
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <label>가게 이름</label>
          <div className="store-edit-name">
            <input
              type="text"
              value={name}
              placeholder="가게 이름 입력"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <label>가게 주소</label>
          <div className="store-edit-location">
            <input
              type="text"
              value={location}
              placeholder="가게 주소 입력"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <label>가게 정보</label>
          <div className="store-edit-content">
            <input
              type="text"
              value={content}
              placeholder="가게 정보 입력"
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          {/* submit button */}
          <button className="store-save-button">저장하기</button>
        </div>
      </form>
    </div>
  );
};

export default SellerStoreManagement;
