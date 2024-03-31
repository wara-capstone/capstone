import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CardList from "../components/CardList";
import React, { useEffect, useState } from "react";
import ClothFeedList from "../components/ClothFeedList";

export default function Search() {
  let [searchText, setSearchText] = useState(""); // 검색창 값

function myFunction(event) {
  event.preventDefault();



  console.log(searchText);
}

  return (
    <div className="search">
      <Header />

      <SearchBar searchText={searchText} setSearchText={setSearchText} onSubmit={myFunction}/>
      <h2>준비 중인 서비스입니다.</h2>
        <ClothFeedList />
      {/* <CardList /> */}

      <BottomNav />
    </div>
  );
}