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

      <Link to="/cart" className="link">
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
      </Link>
    </header>
  );
}

export default Header;
