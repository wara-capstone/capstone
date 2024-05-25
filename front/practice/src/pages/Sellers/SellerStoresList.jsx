import "./Seller.css";
import SellerHeader from "./SellerHeader";
//import Card from "../../components/Card";
import { Card } from "antd";
import { Link } from "react-router-dom";

import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../../components/LoadingScreen";
const token = localStorage.getItem("token");

const { Meta } = Card;

// Store 컴포넌트 정의
const StoresListPage = () => {
  // props에서 productInfo 추출

  const [storeInfo, setStoreInfo] = useState({ result: "", data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await axios.get(
        `${process.env.NODE_ENV === "development" ? "" : ""}${
          process.env.REACT_APP_API_URL
        }store/read/seller/${localStorage.getItem("email")}`, // 이 부분은 실제 서버 주소와 API 경로로 변경해야 합니다.
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      console.log("받아온 값:" + JSON.stringify(result.data)); // 서버로부터 받아온 데이터를 JSON 문자열로 변환하여 출력
      if (result.data && Array.isArray(result.data.data)) {
        setStoreInfo(result.data);
      } else {
        setStoreInfo({ data: [] });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingScreen></LoadingScreen>;
  } else {
    return (
      <div className="seller-store">
        <SellerHeader />
        <h1>가게 목록</h1>

        <div className="card-link" style={{ zIndex: 100 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {storeInfo.data.map((store, index) => (
              <div style={{ padding: 30 }}>
                <Link
                  to={`/seller/item/management/select/${store.storeId}`}
                  key={store.storeId}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    hoverable
                    style={{
                      width: 350,
                      height: 600,
                      boxShadow: " 0 5px 10px rgba(0, 0, 0, 0.2)",
                    }}
                    cover={
                      <div style={{ width: 350, height: 200 }}>
                        <img
                          alt="example"
                          src={store.storeImage}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                    }
                  >
                    <Meta title={store.storeName} description={""} />
                    <p>주소 : {store.storeAddress}</p>
                    <p>전화번호 : {store.storePhone}</p>
                    <p>{store.storeContents}</p>
                  </Card>

                  <div>{index === 3 ? <br></br> : null}</div>

                  {/* <Card
              title={store.storeName}
              content={store.storeAddress}
              content2={store.storePhone}
              content3={store.storeContents}
              mainImage={store.storeImage}

            /> */}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};
export default StoresListPage;
