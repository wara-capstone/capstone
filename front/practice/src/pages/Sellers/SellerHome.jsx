import { Link } from "react-router-dom";
import sellerAd from "../../adImages/sellerAd.png";
import EventButton from "../../components/EventButton";

import React from "react";
import "./Seller.css";
import SellerHeader from "./SellerHeader";

export default function SellerHome() {
  const email = sessionStorage.getItem("email");
  const token = sessionStorage.getItem("token");

  // useEffect(() => {
  //     const fetchData = async () => {
  //     const response = await fetch(
  //       'https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/user?email='+email,
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

  return (
    <div className="seller-home">
      <SellerHeader />
      <div className="ad-image-container">
        <img src={sellerAd} className="ad-image" alt="sellerAd" />
      </div>
      <Link to="/seller/store/register">
        <EventButton buttonText={"가게 관리하기"} />
      </Link>
    </div>
  );
}
