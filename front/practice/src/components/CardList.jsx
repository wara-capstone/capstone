import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRefreshToken } from "../utils/authUtil";
import Card from "./Card"; // Card 컴포넌트 임포트
import "./Card.css";

function CardList({ category, url }) {
  const { id } = useParams();

  const userId = localStorage.getItem("email");
  const userRole = localStorage.getItem("role");
  const storeId = localStorage.getItem("storeid");
  const token = localStorage.getItem("token");
  const RefreshToken = localStorage.getItem("RefreshToken");

  const [categoryData, setCategoryData] = useState(null); // 상태 추가
  var result;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (response.status === 401) {
        RefreshToken = localStorage.getItem("RefreshToken");
        fetchRefreshToken(RefreshToken);
        token = localStorage.getItem("token");
      }

      if (response.status === 200) {
        const data = await response.json(); // response.json()이 완료될 때까지 기다림

        setCategoryData(data); // 상태 업데이트

        console.log(data);

        // if (data && data[0] && data[0].productId) {
        //   console.log(data[0].productId);
        // } else {
        //   console.log("등록된 상품이 없음.");
        // }

        // if (data && data[0]) {
        //   //console.log(data[0].productId);
        // }

        // console.log(url);
        // //console.log(data);
        // console.log("성공");
      } else {
        console.log("실패");
      }
    };
    fetchData();
  }, [category, token]);

  return (
    <div className="card-list">
      {categoryData &&
        categoryData.map((result) => {
          if (result.options && result.options.length > 0) {
            return (
              <Link
                to={`/item/${result.productId}`}
                key={result.productId}
                className="card-link"
              >
                <Card
                  key={result.productId}
                  title={result.productName}
                  subTitle={result.productCategory}
                  price={result.options[0].productPrice}
                  mainImage={result.productUrls[0]}
                  // count={result.options[0].productStock}
                />
              </Link>
            );
          }
        })}
    </div>
  );
}

export default CardList;
