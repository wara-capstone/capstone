import { Link } from "react-router-dom";
import sellerAd from "../../adImages/sellerAd.png";

import React, { useEffect } from "react";
import "./Seller.css";
import SellerHeader from "./SellerHeader";

export default function SellerHome() {
  const email = localStorage.getItem("email");
  let token = localStorage.getItem("token");

  // useEffect(() => {
  //     const fetchData = async () => {
  //     const response = await fetch(
  //       '$${process.env.NODE_ENV === 'development' ? 'http://' : 'https:'}//{process.env.REACT_APP_API_URL}user?email='+email,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           // "Authorization": `${token}`
  //         },
  //       }
  //     );
  //     const result = await response.json();
  //     if (response.status === 200) {
  //       console.log("성공");
  //     } else {
  //       console.log("실패");
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    console.log("현재 페이지"+ localStorage.getItem("email"), localStorage.getItem("token"));
  }, []);

  return (
    <div className="seller-home">
      <SellerHeader />
      <div className="ad-image-container">
        <img src={sellerAd} className="ad-image" alt="sellerAd" />
      </div>
      <Link to="/seller/store/register">
        {/* <EventButton buttonText={"가게 관리하기"} /> */}
        <button className="connect-store-register-button">가게 관리하기</button>
      </Link>
    </div>
  );
}
