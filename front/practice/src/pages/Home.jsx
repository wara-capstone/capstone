import adImage1 from "../adImages/ad1.png";
import adImage2 from "../adImages/ad2.png";
import adImage3 from "../adImages/ad3.png";

import React from "react";
import AdComponent from "../components/AdComponent";
import BottomNav from "../components/BottomNav";
import Category from "../components/Category";
import Header from "../components/Header";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const adImages = [
    { id: "1", src: adImage1 },
    { id: "2", src: adImage2 },
    { id: "3", src: adImage3 },
    // 추가 이미지 경로
  ];

  var itemList = [];

  // useEffect(() => {
  //     const fetchData = async () => {
  //     const response = await fetch(
  //       '$${process.env.NODE_ENV === 'development' ? 'http://' : 'https:'}//{process.env.REACT_APP_API_URL}user?',
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const result = await response.json();
  //     if (response.status === 200) {
  //       // result.map((item) => {
  //       // });
  //       console.log("성공");
  //     } else {
  //       console.log("실..패..");
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <div className="home">
      <Header />
      <div className="ad-image-container">
        <AdComponent images={adImages} />
      </div>
      <Category
        //현재 메인화면에서 카테고리 선택을 하지 않을 시, 상의 상품을 보여주도록 설정함. 추후 수정 필요.
        allUrl={`${process.env.NODE_ENV === "development" ? "" : ""}${
          process.env.REACT_APP_API_URL
        }product/all/category/상의`}
        categoryUrl={`${
          process.env.NODE_ENV === "development" ? "" : ""
        }${process.env.REACT_APP_API_URL}product/all/category/`}
      />
      {/* <CardList /> */}
      <div>
      <Link to="/user/pageUpload" className="user-link">
            <button className="upload-btn">
              <span role="img" aria-label="upload">📤</span> 글 업로드
                <div className="move-page-icon">
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
            </button>
          </Link>
      </div>
      <BottomNav />
    </div>
  );
}
