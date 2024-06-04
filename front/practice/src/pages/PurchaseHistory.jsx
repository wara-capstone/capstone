import { Link, useNavigate } from "react-router-dom";
import Data from "../DB/Data.json";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card"; // Card 컴포넌트 임포트
import EventButton from "../components/EventButton";
import Header from "../components/Header";
import { useEffect, useState ,useRef}  from "react";
import { useLocation } from "react-router-dom";
import PurchaseProduct from "../components/PurchaseProduct";
import "../components/CartComponents.css";
import PurchaseHistoryCard from "../components/PurchaseHistoryCard";
import {
  message
}from "antd";
import { fetchRefreshToken } from "../utils/authUtil";
import moment from 'moment';
import { all } from "axios";

export default function PurchaseHistory() {

    const [paymentItems, setPaymentItems] = useState ([]);
    // const paymentItems = useRef([]);

    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    let token = localStorage.getItem("token");
    const [quantity, setQuantity] = useState([]); // 수량
    const [price, setPrice] = useState([]); // 제품 하나의 가격
    const [totalPrice, setTotalPrice] = useState(0); // 제품 당 가격

    // 총 금액
//   const totalPrice = purchaseItems.reduce((acc, item) => acc + (item.product.price), 0);



  useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}payment/read/user/${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${token}`
            },
          }
        );

        if (response.status === 401) {
          const RefreshToken = localStorage.getItem("RefreshToken");
          fetchRefreshToken(RefreshToken);
          token = localStorage.getItem("token");
        }
  
        if (response.status === 200) {
          const result = await response.json();
          console.log("구매 내역 조회 요청은 성공");
          console.log(result);

          if(result.result === "success"){
            console.log("구매 내역이 존재합니다.");
            
            let allPurchaseItems = [];
            let allPaymentPrice = 0;

            // result.data.forEach(async data => {
              for (const data of result.data) {
              allPaymentPrice += data.totalPrice;
              // setTotalPrice(totalPrice => totalPrice += data.totalPrice);

              const purchaseItems = [];

              // data.paymentDTOS.map(async payment => {
                for (const payment of data.paymentDTOS) {
              let productId = payment.productId;
              let optionId = payment.optionId;

              let response2 =  await fetch(
                `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}product/all/${productId}/option/${optionId}`,
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
                purchaseItems.push(result);


                console.log("하나씩 조회");
                console.log(purchaseItems)
              } else {
                console.log("실패");
              }

              // });
            }  
              console.log(data.totalPrice);
              console.log("구매 시간은 " + data.dateTime + "입니다.");
              purchaseItems["dateTime"] = data.dateTime;
              purchaseItems["paymentPrice"] = data.totalPrice;
              // setPaymentItems(prevItems => [...prevItems, purchaseItems]);
              allPurchaseItems.push(purchaseItems);
              }
              // });
              // setPaymentItems(prevItems => [...prevItems].reverse());
                      // 모든 데이터 로딩 후 한번에 상태 업데이트
              setPaymentItems(allPurchaseItems.reverse());
              setTotalPrice(allPaymentPrice);
          // setPaymentItems(allPurchaseItems);
          }
          else{
            message.success("구매 내역이 존재하지 않습니다!");
          }

        } else{
          message.error("구매 내역을 불러오는데 실패하였습니다.", 1);
        }
      };
      fetchData();
  }, [token]);




  return (
    <div className="cart-page">
      <Header />
      <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px'}}>
        <div>
          <label>구매 상품 개수: </label>
          <span>{paymentItems.length}</span>
        </div>
        <div>
          <label>총 구매 금액: </label>
          <span>{totalPrice.toLocaleString()}원</span> 
        </div>
      </div>
      <div>
        {paymentItems.length > 0 ? ( 
            <div className="Cart">
        {
        paymentItems.map((paymentDTO, num) =>(
          console.log(paymentDTO),
          <div>
            <hr />
          <h3>구매일자 : {moment.utc(paymentDTO.dateTime).format('YYYY-MM-DD')}</h3>
          {paymentDTO.map((data, index) => (
        <PurchaseHistoryCard
            key={index}
            data={data}
        />
        ))}
        <h3>총 구매 금액: {paymentDTO.paymentPrice}원</h3>
        </div>
      ))
      
        }
      
        </div>
        ):( <h2>구매내역이 없습니다.</h2> // 상품이 없을 때 표시할 메시지 또는 컴포넌트
        )}
        </div>

        {/* <div style={{display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
        <div>
          <label>구매 상품 개수: </label>
          <span>{paymentItems.length}</span>
        </div>
        <div>
          <label>총 구매 금액: </label>
          <span>{totalPrice.toLocaleString()}원</span> 
        </div>
      </div> */}

      {/* <EventButton buttonText={"결제"} onClick={clickPurchase} /> */}
      <BottomNav />
    </div>
  );
}
