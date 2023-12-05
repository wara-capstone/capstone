import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Category from "../components/Category";
import EventButton from "../components/EventButton";
import Header from "../components/Header";

export default function Store() {
  const { id } = useParams();

  const userId = localStorage.getItem("email");
  const userRole = localStorage.getItem("role");
  const storeId = localStorage.getItem("storeid");
  const token = localStorage.getItem("token");

  const [storeData, setStoreData] = useState(null); // 상태 추가
  var result;

  const navigate = useNavigate();

  const handleConnectChatting = () => {
    // 채팅버튼 클릭 시 로그인 상태 체크 후 라우팅 진행.
    if (userId === null) {
      navigate("/login");
    } else if (userId !== null) {
      if (userId === storeData.storeSeller) {
        message.error("자신의 상점과는 상담하실 수 없습니다.", 2);
      } else {
        navigate(`/chatting/${storeData.storeSeller}`, {
          state: { seller: storeData.storeSeller },
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://52.79.186.117:8000/api/store/read/id/" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      result = await response.json();
      if (response.status === 200) {
        setStoreData(result.data); // 상태 업데이트
        //console.log(result.storeId);
        //console.log(result);
        //console.log(result.storeName);
        console.log("상점정보 가져오기 성공");
      } else {
        console.log("실패");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="store">
      <Header />
      {storeData && ( // storeData가 null이 아닐 때만 렌더링
        <div key={storeData.storeId}>
          <div className="item-image-container">
            <img
              src={storeData.storeImage}
              alt={storeData.storeName}
              className="item-image"
            />
          </div>
          <h1>{storeData.storeName}</h1>
          <div className="button-link" onClick={handleConnectChatting}>
            <EventButton buttonText={"1대1 상담"} />
          </div>
          <p>
            <span style={{ fontWeight: "bold" }}>가게위치:</span>{" "}
            {storeData.storeAddress}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>가게정보:</span>{" "}
            {storeData.storeContents}
          </p>
        </div>
      )}

      <Category
        allUrl={`http://52.79.186.117:8000/api/product/all/store/${id}`}
        categoryUrl={`http://52.79.186.117:8000/api/product/all/store/${id}/category?category=`}
      />

      <BottomNav />
    </div>
  );
}
