import { faAngleLeft, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const locationNow = useLocation();
  let navigate = useNavigate();

  let goBack = () => {
    navigate(-1);
  };

  const userId = localStorage.getItem("email");
  const userRole = localStorage.getItem("role");
  const storeId = localStorage.getItem("storeid");
  const token = localStorage.getItem("token");

  let url;

  const handleConnectCart = () => {
    // 장바구니아이콘 클릭 시 로그인 상태 체크 후 라우팅 진행.
    if (userId === null) {
      navigate("/login");
    } else if (userId !== null) {
      navigate("/cart");
    }
  };

  return (
    <header className="header">
      <div className="back">
        <FontAwesomeIcon
          icon={faAngleLeft}
          className="back-icon"
          onClick={goBack}
        />
      </div>

      <Link to="/" className="link">
        <h1 className="title">On&Off</h1>
      </Link>

      <Link to="/search" className="link">
        <div>
          <FontAwesomeIcon
            icon="magnifying-glass"
            className={
              locationNow.pathname === "/search"
                ? "search-icon active-search-icon"
                : "search-icon"
            }
          />
        </div>
      </Link>

      <div to="/cart" className="link" onClick={handleConnectCart}>
        <div className="cart">
          <FontAwesomeIcon
            icon={faCartShopping}
            className={
              locationNow.pathname === "/cart"
                ? "cart-icon active-cart-icon"
                : "cart-icon"
            }
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
