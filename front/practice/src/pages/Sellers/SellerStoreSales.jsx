import React, { useEffect, useState } from "react";
import "./Seller.css";
import SellerHeader from "./SellerHeader";
import SellerSideNav from "./SellerSideNav";

export default function SellerStoreSales() {
  const [payments, setPayments] = useState([]);
  const storeId = 29; // 실제 storeId 값으로 대체

  const email = sessionStorage.getItem("email");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    async function fetchPayments() {
      try {
        const response = await fetch(
          `https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/payment/read/store/${storeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        alert("성공!");
        console.log(data.result);

        if (data.data !== null) {
          setPayments(data.data); // 상태 업데이트
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    }

    fetchPayments();
  }, [storeId]);

  return (
    <div className="seller-store-sales">
      <SellerHeader />
      <div className="store-sales-container">
        <SellerSideNav />
        <div>
          <h2>Payment List</h2>
          <table>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Store ID</th>
                <th>Product ID</th>
                <th>Option ID</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Date Time</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                if (payment === null) return null;
                return (
                  <tr key={payment.paymentId}>
                    <td>{payment.paymentId}</td>
                    <td>{payment.storeId}</td>
                    <td>{payment.productId}</td>
                    <td>{payment.optionId}</td>
                    <td>{payment.price}</td>
                    <td>{payment.quantity}</td>
                    <td>{payment.dateTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
