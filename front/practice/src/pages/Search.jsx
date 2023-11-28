import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CardList from "../components/CardList";
import React, { useEffect, useState } from "react";

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

      <CardList />

      <BottomNav />
    </div>
  );
}
