import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({searchText, setSearchText, style, onSubmit}) => {

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 검색 기능 또는 원하는 동작 수행
    console.log("검색어:", searchText);
    setSearchText("");
  };
  

  return (
    <form className="search-bar" onSubmit={onSubmit} style={style}>
      <FontAwesomeIcon icon={faMagnifyingGlass} className="back-icon" />
      <input
        type="search"
        placeholder="검색어를 입력하세요"
        value={searchText}
        onChange={handleSearchChange}
      />
      <button type="submit">검색</button>
    </form>
  );
};

export default SearchBar;
