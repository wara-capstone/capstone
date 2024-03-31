import { BrowserRouter, Route, Routes } from "react-router-dom";

import Barcode from "./pages/Barcode";
import Cart from "./pages/Cart";
import Feed from "./pages/Feed";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Search from "./pages/Search";
import User from "./pages/User";

import Chatting from "./pages/Chatting";
import ChattingList from "./pages/ChattingList";
import Item from "./pages/Item";
import Purchase from "./pages/Purchase";
import PurchaseHistory from "./pages/PurchaseHistory";
import Store from "./pages/Store";
import UserEdit from "./pages/UserEdit";

import LoadingPage from "./pages/LodingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupChoice from "./pages/SignupChoice";

import SellerChattingManagement from "./pages/Sellers/SellerChattingManagement";
import SellerHome from "./pages/Sellers/SellerHome";
import SellerItemManagement from "./pages/Sellers/SellerItemManagement";
import SellerStoreEdit from "./pages/Sellers/SellerStoreEdit";
import SellerStoreRegister from "./pages/Sellers/SellerStoreRegister";
// import SellerStoreManagement from "./pages/Sellers/SellerStoreManagement";
import SellerProductRegistration from "./pages/Sellers/SellerProductRegistration";
import SellerStoresList from "./pages/Sellers/SellerStoresList";

import "./App.css";
import SellerStoreSales from "./pages/Sellers/SellerStoreSales";

export default function Customer() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/barcode" element={<Barcode />} />
          <Route path="/search" element={<Search />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/user" element={<User />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/store/:id" element={<Store />} />
          <Route path="/chatting/:id" element={<Chatting />} />
          <Route path="/user/edit" element={<UserEdit />} />
          <Route path="/user/chattingList" element={<ChattingList />} />
          <Route path="/user/purchase" element={<Purchase />} />
          <Route path="/user/purchaseHistory" element={<PurchaseHistory />} />

          {/* 사장님 페이지 */}
          <Route path="/seller" element={<SellerHome />} />
          <Route
            path="/seller/store/register"
            element={<SellerStoreRegister />}
          />
          <Route
            path="/seller/chatting"
            element={<SellerChattingManagement />}
          />
          <Route
            path="/seller/item/management"
            element={<SellerStoresList />}
          />
          <Route path="/seller/store/edit" element={<SellerStoreEdit />} />

          <Route path="/seller/store/sales" element={<SellerStoreSales />} />

          {/* <Route
            path="/seller/store/management"
            element={<SellerStoreManagement />}
          /> */}

          <Route
            path="/seller/item/management/select/:storeId"
            element={<SellerItemManagement />}
          />
          <Route
            path="/seller/item/management/select/:storeId/:productId"
            element={<SellerProductRegistration />}
          />
          {/* 로그인 페이지 */}
          <Route path="/login" element={<Login />} />

          {/* 회원가입 페이지 */}
          <Route path="/signup-choice" element={<SignupChoice />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/loading" element={<LoadingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
