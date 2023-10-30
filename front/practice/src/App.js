import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";

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

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/barcode" element={<Barcode />} />
          <Route path="/search" element={<Search />} />
          <Route path="/user" element={<User />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/store/:id" element={<Store />} />
          <Route path="/chatting" element={<Chatting />} />
          <Route path="/user/edit" element={<UserEdit />} />
          <Route path="/user/chattingList" element={<ChattingList />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
