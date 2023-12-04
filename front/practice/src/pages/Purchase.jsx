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
import{
  message
} from "antd";

export default function Purchase() {
  const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

  const location = useLocation();
    const { checkList, selectedItems } = location.state;

    // 총 금액
  const totalPrice = selectedItems.reduce((acc, item) => acc + (item.product.price), 0);


  useEffect(() => { // ProductId, pColor, pSize로 optionId 가져오기
    selectedItems.forEach(item => {
      const productId = item.product.p_id;
      const pColor = item.product.color;
      const pSize = item.product.size;

      const fetchData = async () => {
        const response = await fetch(
          `http://52.79.186.117:8000/api/product/all/product/${productId}/${pColor}/${pSize}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${token}`
            },
          }
        );
       const result = await response.json();
        if (response.status === 200) {
          console.log("성공");
          console.log(result);
          item.product.optionId = result;

        } else {
          console.log("실패");
        }
      };
      fetchData();
    });
  }, []);



async function clickPurchase(e) {
    // Create payload
    const totoalPayment = {
      purchaser: email,
      totalPrice: totalPrice
      }

      const payment = selectedItems.map(item => {
        return {
          storeId: item.store_id,
          productId: item.product.p_id,
          optionId: item.product.optionId,
          price: item.product.price / item.product.quantity,
          quantity: item.product.quantity,
        };
      });


    var formData;
      formData = new FormData();
      formData.append('totalPayment', new Blob([JSON.stringify(totoalPayment)], { type: "application/json" }));
      formData.append('payment', new Blob([JSON.stringify(payment)], { type: "application/json" }));

    try {
      const response = await fetch(
        "http://52.79.186.117:8000/api/payment/create",
        {
          method: "POST",
          headers: {
            "Authorization": `${token}`
          },
          body: formData
        }
      );
      console.log(response);
      if (response.status === 201) {
        
        message.success("구매가 완료되었습니다.", 2);

        if (checkList !== undefined) {
        // 구매후 장바구니 삭제
        var deleteString ='';
        checkList.forEach(id => {
          deleteString += `&cart_item_id=${id}`;
        });
    
        console.log(deleteString);
          const fetchData = async () => {
           const response = await fetch(
             'http://52.79.186.117:8000/api/cart/items/?user_email='+email+deleteString,
             {
               method: "DELETE",
               headers: {
                 "Content-Type": "application/json",
                 "Authorization": `${token}`
               },
             }
           );
           if (response.status === 204) {
             console.log("성공");
           }
            else {
            console.log(response);
             console.log("실패");
             console.log(response.status);
           }
         };
         fetchData();
        }

         navigate("/");

      } else if (response.status !== 201) {
          const errorData = await response.json();
          console.log(errorData);
      }
      else if (response.status === 400) {
        // Handle error
        message.error("잘못된 요청입니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      message.error("잘못된 요청입니다.");
    }
}


  return (
    <div className="cart-page">
      <Header />
      <div>
        {selectedItems.length && ( 
            <div className="Cart">
    {selectedItems.map(selectedBread =>(
        <PurchaseProduct
            selectedBread={selectedBread}
            key={selectedBread.cart_item_id}
            // changeSingleBox={changeSingleBox}
            data={selectedBread}
            // checkList={checkList}
        />
        ))}
        </div>
        )}
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
        <div>
          <label>구매 상품 개수: </label>
          <span>{selectedItems.length}</span>
        </div>
        <div>
          <label>결제 총 금액: </label>
          <span>{totalPrice.toLocaleString()}원</span> 
        </div>
      </div>

      <EventButton buttonText={"결제"} onClick={clickPurchase} />
      <BottomNav />
    </div>
  );
}
