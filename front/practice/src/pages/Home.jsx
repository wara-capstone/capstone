import adImage1 from "../adImages/ad1.png";
import adImage2 from "../adImages/ad2.png";
import adImage3 from "../adImages/ad3.png";

import React, { useEffect, useState } from "react";
import AdComponent from "../components/AdComponent";
import BottomNav from "../components/BottomNav";
import CardList from "../components/CardList";
import Header from "../components/Header";

export default function Home() {
  const adImages = [
    { id: "1", src: adImage1 },
    { id: "2", src: adImage2 },
    { id: "3", src: adImage3 },
    // 추가 이미지 경로
  ];

  var itemList = [];

  useEffect(() => {
      const fetchData = async () => {
      const response = await fetch(
        'https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/user?',
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (response.status === 200) {
        // result.map((item) => {
        // });
        console.log("성공");
      } else {
        console.log("실..패..");
      }
    };
    fetchData();
  }, []);



  return (
    <div className="home">
      <Header />
      <div className="ad-image-container">
        <AdComponent images={adImages} />
      </div>
      <CardList />
      <BottomNav />
    </div>
  );
}
