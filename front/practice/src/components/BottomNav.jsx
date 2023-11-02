import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./BottomNav.css";
// 사용할 아이콘 import
import "./FontAwesome";
// FontAwesomIcon 컴포넌트를 사용하기 위해 import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";




const BottomNav = () => {
  // 현재 선택된 아이콘을 관리하는 state
  const locationNow = useLocation();


  if (
    locationNow.pathname === "/" ||
    locationNow.pathname === "/search" ||
    locationNow.pathname === "/user" ||
    locationNow.pathname === "/map" ||
    locationNow.pathname === "/barcode"
  ) {
    return (
      <nav className="nav-wrapper">
        {/* 하단 네비게이션 최상위 태그 */}
        <Link to="/map" className="nav-link">
          <div>
            <FontAwesomeIcon
              icon="map-location-dot"
              className={
                locationNow.pathname === "/map"
                  ? "nav-item active-nav-item"
                  : "nav-item"
              }
            />
            {/* 네비게이션을 구성하고 있는 하나의 버튼 */}
          </div>
        </Link>
        <Link to="/barcode" className="nav-link">
          <div>
            <FontAwesomeIcon
              icon="barcode"
              className={
                locationNow.pathname === "/barcode"
                  ? "nav-item active-nav-item"
                  : "nav-item"
              }
            />
          </div>
        </Link>
        <Link to="/" className="nav-link">
          <div>
            <FontAwesomeIcon
              icon="home"
              className={
                locationNow.pathname === "/"
                  ? "nav-item active-nav-item"
                  : "nav-item"
              }
            />
          </div>
        </Link>
        <Link to="/search" className="nav-link">
          <div>
            <FontAwesomeIcon
              icon="magnifying-glass"
              className={
                locationNow.pathname === "/search"
                  ? "nav-item active-nav-item"
                  : "nav-item"
              }
            />
          </div>
        </Link>
        <Link to="/user" className="nav-link">
          <div>
            <FontAwesomeIcon
              icon="user"
              className={
                locationNow.pathname === "/user"
                  ? "nav-item active-nav-item"
                  : "nav-item"
              }
            />
          </div>
        </Link>
      </nav>
    );
  } else {
    return null;
  }
};

export default BottomNav;
