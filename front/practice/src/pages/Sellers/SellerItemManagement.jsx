import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Seller.css";
import SellerHeader from "./SellerHeader";
import SellerItem from "./SellerItem";

export default function SellerItemManagement() {
  return (
    <div className="seller-item-management">
      <SellerHeader />
      <SellerItem />

      <div className="item-add-icon">
        <FontAwesomeIcon icon={faPlus} />
      </div>
    </div>
  );
}
