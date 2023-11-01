import { Link } from "react-router-dom";
import sellerAd from "../../adImages/sellerAd.png";
import EventButton from "../../components/EventButton";

import "./Seller.css";
import SellerHeader from "./SellerHeader";

export default function SellerHome() {
  return (
    <div className="seller-home">
      <SellerHeader />
      <div className="ad-image-container">
        <img src={sellerAd} className="ad-image" alt="sellerAd" />
      </div>
      <Link to="/seller/store/management">
        <EventButton buttonText={"가게 관리하기"} />
      </Link>
    </div>
  );
}
