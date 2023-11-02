import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Data from "../DB/Data.json";
import BottomNav from "../components/BottomNav";
import EventButton from "../components/EventButton";
import Header from "../components/Header";

export default function Store() {
  const { id } = useParams();
  const selectedStore = Data.storeDate.filter(
    (store) => store.id === Number(id)
  );

  const userId = sessionStorage.getItem("email");
  const userRole = sessionStorage.getItem("role");
  const storeId = sessionStorage.getItem("storeid");
  const token = sessionStorage.getItem("token");

  let url;

  const navigate = useNavigate();

  const handleConnectChatting = () => {
    // 채팅버튼 클릭 시 로그인 상태 체크 후 라우팅 진행.
    if (userId === null) {
      navigate("/login");
    } else if (userId !== null) {
      navigate("/chatting");
    }
  };

  return (
    <div className="store">
      <Header />
      {selectedStore.map((store) => (
        <div key={store.id}>
          <div className="item-image-container">
            <img
              src={store.images[0].image}
              alt={store.title}
              className="item-image"
            />
          </div>
          <h1>{store.title}</h1>
          <p>store location: {store.subTitle}</p>
          <p>store detail: {store.content}</p>
        </div>
      ))}
      <div className="button-link" onClick={handleConnectChatting}>
        <EventButton buttonText={"1대1 상담"} />
      </div>
      <BottomNav />
    </div>
  );
}
