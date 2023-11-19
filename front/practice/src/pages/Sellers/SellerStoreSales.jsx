import "./Seller.css";
import SellerHeader from "./SellerHeader";
import SellerSideNav from "./SellerSideNav";

export default function SellerStoreSales() {
  return (
    <div className="seller-store-sales">
      <SellerHeader />
      <div className="store-sales-container">
        <SellerSideNav />
      </div>
    </div>
  );
}
