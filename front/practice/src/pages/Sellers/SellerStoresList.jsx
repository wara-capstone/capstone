import "./Seller.css";
import SellerHeader from "./SellerHeader";
import Card from "../../components/Card"; 
import { Link } from "react-router-dom";


import React, { useState, useEffect } from 'react';
import axios from 'axios';
const token = sessionStorage.getItem("token");

// Store 컴포넌트 정의
const StoresListPage = () => {
  // props에서 productInfo 추출

  const [storeInfo, setStoreInfo] = useState({ result: "", data: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        'https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/store/read/seller/seller@naver.com', // 이 부분은 실제 서버 주소와 API 경로로 변경해야 합니다.
        {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${token}`
            },
          }
        );
        console.log("받아온 값:" + JSON.stringify(result.data)); // 서버로부터 받아온 데이터를 JSON 문자열로 변환하여 출력
        if(result.data && Array.isArray(result.data.data)) {
          setStoreInfo(result.data);
        } else {
          setStoreInfo({ data: [] });
        }
    };
 
    fetchData();
  }, []);

  return (
    <div className="seller-store">
      <SellerHeader />
      <h1>가게 목록</h1>
      
      <div className="card-link" style={{zIndex:100}}>
      {storeInfo.data.map((store) => (
        <Link to={`/seller/item/management/select/${store.storeId}`} key={store.storeId}>
          <Card
              title={store.storeName}
              content={store.storeAddress}
              content2={store.storePhone}
              content3={store.storeContents}
              mainImage={store.storeImage}

            />
        </Link>
      ))}
      </div>
    </div>
  );
};

export default StoresListPage;
