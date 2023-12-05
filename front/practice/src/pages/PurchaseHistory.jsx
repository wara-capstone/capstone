import { Link, useNavigate } from "react-router-dom";
import Data from "../DB/Data.json";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card"; // Card 컴포넌트 임포트
import EventButton from "../components/EventButton";
import Header from "../components/Header";
import { useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import PurchaseProduct from "../components/PurchaseProduct";
import "../components/CartComponents.css";
import PurchaseHistoryCard from "../components/PurchaseHistoryCard";
import {
  message
}from "antd";

export default function PurchaseHistory() {

    const [purchaseItems, setPurchaseItems] = useState ([]);
    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const [quantity, setQuantity] = useState([]); // 수량
    const [price, setPrice] = useState([]); // 제품 하나의 가격
    const [totalPrice, setTotalPrice] = useState(0); // 제품 당 가격

    // 총 금액
//   const totalPrice = purchaseItems.reduce((acc, item) => acc + (item.product.price), 0);


  useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(
          `http://52.79.186.117:8000/api/payment/read/user/${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${token}`
            },
          }
        );
        if (response.status === 200) {
          const result = await response.json();
          console.log("구매 내역 조회 요청은 성공");
          console.log(result);

          if(result.result === "success"){
            console.log("구매 내역이 존재합니다.");
            result.data.map(data => {
              setTotalPrice(totalPrice => totalPrice += data.totalPrice);

              data.paymentDTOS.map(async payment => {
              let productId = payment.productId;
              let optionId = payment.optionId;



              let response2 =  await fetch(
                `http://52.79.186.117:8000/api/product/all/${productId}/option/${optionId}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                  },
                }
              );
              if (response2.status === 200) {
                const result = await response2.json();
                result["quantity"] = payment.quantity;
                result["price"] = payment.price;
                setPurchaseItems(prevItems => [...prevItems, result]);
              } else {
                console.log("실패");
              }
              }
              );
          });
          }
          else{
            message.success("구매 내역이 존재하지 않습니다!");
          }

        } else{
          message.error("구매 내역을 불러오는데 실패하였습니다.", 1);
        }
        console.log("구매내역", purchaseItems);
      };
      fetchData();
  }, []);



  return (
    <div className="cart-page">
      <Header />
      <div>
        {purchaseItems.length > 0 ? ( 
            <div className="Cart">
    {purchaseItems.map(data =>(
        <PurchaseHistoryCard
            data={data}
        />
        ))}
        </div>
        ):( <h2>구매내역이 없습니다.</h2> // 상품이 없을 때 표시할 메시지 또는 컴포넌트
        )}
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
        <div>
          <label>구매 상품 개수: </label>
          <span>{purchaseItems.length}</span>
        </div>
        <div>
          <label>총 구매 금액: </label>
          <span>{totalPrice.toLocaleString()}원</span> 
        </div>
      </div>

      {/* <EventButton buttonText={"결제"} onClick={clickPurchase} /> */}
      <BottomNav />
    </div>
  );
}
