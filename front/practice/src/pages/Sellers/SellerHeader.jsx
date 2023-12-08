import React from "react";
import { Link } from "react-router-dom";
import "./Seller.css";

function SellerHeader() {
  const email = localStorage.getItem("email");

  return (
    <header className="seller-header">
      <Link to="/seller" className="seller-title-link">
        <h1 className="title">On&Off사장님</h1>
      </Link>

      <div className="seller-header-container">
        <Link to="/user" className="seller-header-link">
          <h2 className="seller-header-menu" style={{ color: "gray" }}>
            마이페이지
          </h2>
        </Link>

        <Link to="/seller/store/register" className="seller-header-link">
          <h2 className="seller-header-menu">가게관리</h2>
        </Link>
        <Link to="/seller/item/management" className="seller-header-link">
          <h2 className="seller-header-menu">상품관리</h2>
        </Link>
        <Link to="/seller/chatting" className="seller-header-link">
          <h2 className="seller-header-menu">상담관리</h2>
        </Link>
      </div>
    </header>
  );
}

export default SellerHeader;
