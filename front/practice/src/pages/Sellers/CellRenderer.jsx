import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Seller.css";
const CellRenderer = (props) => {
  const token = localStorage.getItem("token");
  const [storeInfo, setStoreInfo] = useState({ result: "", data: [] });
  const { storeId, productId } = props;
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/seller/item/management/select/${storeId}/${productId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}store/read/seller/${localStorage.getItem("email")}`,
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
      {/* <span>{cellValue}</span>&nbsp;
      <Link
        to={{
          pathname: `/seller/item/management/select/${storeId}/${productId}`
          // ,          state: { productId: productId },
        }}
      >
        <button class="w-btn w-btn-indigo" 
        style={{ alignItems: 'center', justifyContent: 'center', height : '100%'}}
        type="button"> */}
        <span>{cellValue}</span>&nbsp;
      <button
        className="w-btn w-btn-indigo"
        style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}
        type="button"
        onClick={handleClick}
      >
        등록/수정
    </button>
      {/* </Link> */}
    </span>
  );
};

export default CellRenderer;
