import { Link } from "react-router-dom";
import Data from "../DB/Data.json";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card"; // Card 컴포넌트 임포트
import EventButton from "../components/EventButton";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PurchaseProduct from "../components/PurchaseProduct";
import "../components/CartComponents.css";

export default function Purchase() {

    const email = sessionStorage.getItem("email");
    const token = sessionStorage.getItem("token");

  const location = useLocation();
    const { checkList, selectedItems } = location.state;

    // 총 금액
  const totalPrice = selectedItems.reduce((acc, item) => acc + (item.product.price), 0);


async function clickPurchase(e) {
    // Create payload
    const totoalPayment = {
      purchase: email,
      totalPrice: totalPrice
      }


      const payment = selectedItems.map(item => {
        return {
          storeId: item.store_id,
          productId: item.product.p_id,
          // optionId: item.targetSize,
          price: item.product.price / item.product.quantity,
          quantity: item.product.quantity,
        };
      });


    var formData;
      formData = new FormData();
      formData.append('json', new Blob([JSON.stringify(totoalPayment)], { type: "application/json" }));
      formData.append('json', new Blob([JSON.stringify(payment)], { type: "application/json" }));


    try {
      const response = await fetch(
        " http://3.34.227.3:16000/cart/items/",
        {
          method: "POST",
          headers: {
            "Authorization": `${token}`
          },
          body: formData
        }
      );
      if (response.status === 200) {
        console.log("성공!");
      } else if (response.status !== 200) {
          const errorData = await response.json();
          console.log(errorData);
      }
      
      else if (response.status === 400) {
        // Handle error
        alert(`실패`);
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }


}



  return (
    <div className="cart-page">
      <Header />
      <div>
        {selectedItems. length && ( 
            <div className="Cart">
    {selectedItems.map(selectedBread =>(
        <PurchaseProduct
            selectedBread={selectedBread}
            key={selectedBread.cart_item_id}
            // changeSingleBox={changeSingleBox}
            data={selectedBread}
            checkList={checkList}
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
