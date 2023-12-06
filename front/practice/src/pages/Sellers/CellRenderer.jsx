import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CellRenderer = (props) => {
  const token = localStorage.getItem("token");
  const [storeInfo, setStoreInfo] = useState({ result: "", data: [] });
  const { storeId } = props; // storeId를 props로부터 전달받음
  const { productId } = props;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//${process.env.REACT_APP_API_URL}store/read/seller/${localStorage.getItem("email")}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        console.log("받아온 값:" + JSON.stringify(response.data)); // 서버로부터 받아온 데이터를 JSON 문자열로 변환하여 출력
        if (response.data && Array.isArray(response.data.data)) {
          setStoreInfo(response.data);
        } else {
          setStoreInfo({ data: [] });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const cellValue = props.valueFormatted ? props.valueFormatted : props.value;

  return (
    <span>
      <span>{cellValue}</span>&nbsp;
      <Link
        to={{
          pathname: `/seller/item/management/select/${storeId}/${productId}`
          // ,          state: { productId: productId },
        }}
      >
        <button>등록/수정</button>
      </Link>
    </span>
  );
};

export default CellRenderer;
