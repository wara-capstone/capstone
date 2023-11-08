import { Link, useLocation } from "react-router-dom";

import React from "react";
import "./Seller.css";

export default function SellerSideNav() {
  const locationNow = useLocation();

  return (
    <div className="store-side-nav-container">
      <div className="store-management-side-nav">
        <Link to="/seller/store/register" className="seller-side-nav-link">
          <h2
            className={
              locationNow.pathname === "/seller/store/register"
                ? "store-side-nav-menu active-store-side-nav-menu"
                : "store-side-nav-menu"
            }
          >
            가게등록
          </h2>
        </Link>
        <Link to="/seller/store/management" className="seller-side-nav-link">
          <h2
            className={
              locationNow.pathname === "/seller/store/management"
                ? "store-side-nav-menu active-store-side-nav-menu"
                : "store-side-nav-menu"
            }
          >
            가게관리
          </h2>
        </Link>
      </div>
    </div>
  );
}
