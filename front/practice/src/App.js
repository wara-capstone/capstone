import { BrowserRouter, Route, Routes } from "react-router-dom";

import Barcode from "./pages/Barcode";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Search from "./pages/Search";
import User from "./pages/User";

import Chatting from "./pages/Chatting";
import ChattingList from "./pages/ChattingList";
import Item from "./pages/Item";
import Store from "./pages/Store";
import UserEdit from "./pages/UserEdit";
import Purchase from "./pages/Purchase";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import SellerChattingManagement from "./pages/Sellers/SellerChattingManagement";
import SellerHome from "./pages/Sellers/SellerHome";
import SellerItemManagement from "./pages/Sellers/SellerItemManagement";
import SellerStoreManagement from "./pages/Sellers/SellerStoreManagement";


import "./App.css";

export default function Customer() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/barcode" element={<Barcode />} />
          <Route path="/search" element={<Search />} />
          <Route path="/user" element={<User />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/store/:id" element={<Store />} />
          <Route path="/chatting/:id" element={<Chatting />} />
          <Route path="/user/edit" element={<UserEdit />} />
          <Route path="/user/chattingList" element={<ChattingList />} />
          <Route path="/user/purchase" element={<Purchase />} />

          {/* 사장님 페이지 */}
          <Route path="/seller" element={<SellerHome />} />
          <Route
            path="/seller/chatting"
            element={<SellerChattingManagement />}
          />
          <Route
            path="/seller/item/management"
            element={<SellerItemManagement />}
          />
          <Route
            path="/seller/store/management"
            element={<SellerStoreManagement />}
          />

          {/* 로그인 페이지 */}
          <Route path="/login" element={<Login />} />

          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
