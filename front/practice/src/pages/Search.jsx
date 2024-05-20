import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { fetchRefreshToken } from "../utils/authUtil";

import { BiSort } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";

export default function Search() {
  const [searchText, setSearchText] = useState(""); // 검색창 값
  const token = localStorage.getItem("token");
  const RefreshToken = localStorage.getItem("RefreshToken");
  const [searchData, setSearchData] = useState(null); // 상태 추가
  const [searchResultCount, setSearchResultCount] = useState(0); // 검색 결과 개수 상태
  const [sortText, setSortText] = useState("낮은가격순"); // 정렬 텍스트 상태
  const [sortType, setSortType] = useState("ASC"); // 정렬 타입 상태

  function myFunction(event) {
    event.preventDefault();
    console.log(searchText);

    setSearchText(searchText);

    const encodedSearchText = encodeURIComponent(searchText);

    // API 요청 URL을 구성
    const url = `${process.env.NODE_ENV === "development" ? "http://" : ""}${
      process.env.REACT_APP_API_URL
    }product/all/SEARCH/${encodedSearchText}/0`;

    const sortUrl = `${
      process.env.NODE_ENV === "development" ? "http://" : ""
    }${
      process.env.REACT_APP_API_URL
    }product/all/sort/PRICE/${sortType}/${encodedSearchText}/0`;

    // API 요청
    const fetchData = async () => {
      const response = await fetch(sortUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      if (response.status === 401) {
        fetchRefreshToken(RefreshToken);
      }

      if (response.status === 404) {
        console.log("검색 결과가 없습니다.");
        setSearchData(null);
        setSearchResultCount(0);
      }

      if (response.status === 200) {
        const data = await response.json(); // response.json()이 완료될 때까지 기다림

        setSearchData(data); // 상태 업데이트

        console.log(data);

        if (data != null) {
          setSearchResultCount(data.length);
        } else {
          setSearchResultCount(0);
        }
      } else {
        console.log("실패");
      }
    };
    fetchData();
  }

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태

  // 모달 밖을 클릭했을 때 모달을 닫는 기능 추가
  const modalRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      // 모달이 아닌 부분을 클릭했을 때 모달이 아래로 사라지는 애니메이션 적용
      modalRef.current.style.animation = "modal-slide-down 0.3s ease forwards";
      setTimeout(() => {
        setIsModalOpen(false); // 애니메이션 종료 후 모달 닫기
        modalRef.current.style.animation = ""; // 애니메이션 초기화
      }, 300); // 애니메이션 지속시간과 동일한 시간으로 설정
    }
  };

  // 정렬 아이콘 클릭 핸들러 함수
  const handleSortClick = () => {
    setIsModalOpen(!isModalOpen); // 모달 열기/닫기 토글
  };

  // 모달에서 선택된 옵션을 처리하는 함수
  const handleOptionSelect = (selectedOption) => {
    setSortText(selectedOption);
    setIsModalOpen(false); // 모달 닫기
  };

  useEffect(() => {
    console.log("정렬기준이 변경되었습니다:", sortText);

    if (sortText === "낮은가격순") {
      setSortType("ASC");
    } else if (sortText === "높은가격순") {
      setSortType("DESC");
    }
  }, [sortText]);

  return (
    <div className="search" onClick={handleOutsideClick}>
      <Header />

      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        onSubmit={myFunction}
      />

      <div className="search-item">
        <div className="search-item-num">
          <span style={{ fontSize: "15px" }}>전체&nbsp;</span>
          <span style={{ fontSize: "15px", color: "#336699" }}>
            {searchResultCount}
          </span>
          <span style={{ fontSize: "15px" }}>건</span>
        </div>

        <div className="search-item-sort" onClick={handleSortClick}>
          <span style={{ fontSize: "15px" }}>{sortText}</span>
          <BiSort />
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-background" onClick={handleOutsideClick}>
          <div className="modal" ref={modalRef}>
            <div className="modal-content">
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  marginBottom: "23px", // 텍스트 간의 간격 설정
                }}
              >
                정렬
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "13px", // 텍스트 간의 간격 설정
                  borderBottom: "2px solid #f0f0f0", // 구분선 추가
                }}
                onClick={() => handleOptionSelect("낮은가격순")}
              >
                <div
                  style={{
                    fontWeight: sortText === "낮은가격순" ? "bold" : "normal",
                    fontSize: "18px",
                  }}
                >
                  낮은가격순
                </div>
                {sortText === "낮은가격순" && <FaCheck />}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "13px", // 텍스트 간의 간격 설정
                  borderBottom: "2px solid #f0f0f0", // 구분선 추가
                }}
                onClick={() => handleOptionSelect("높은가격순")}
              >
                <div
                  style={{
                    fontWeight: sortText === "높은가격순" ? "bold" : "normal",
                    fontSize: "18px",
                  }}
                >
                  높은가격순
                </div>
                {sortText === "높은가격순" && <FaCheck />}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="search-result">
        {searchResultCount === 0 && ( // 검색 결과가 없는 경우에만 결과 메시지를 표시
          <h3 className="no-result">
            검색 결과가 없습니다. <br />
            다른 검색어로 검색해보세요.
          </h3>
        )}

        {searchResultCount !== 0 &&
          searchData.map((result, index) => (
            <Link
              to={`/item/${result.productId}`}
              key={`${result.productId}-${index}`} // `productId`와 `index`를 결합하여 고유한 키 생성
              className="card-link"
            >
              <Card
                key={`${result.productId}-${index}`} // `productId`와 `index`를 결합하여 고유한 키 생성
                title={result.name}
                subTitle={result.category}
                price={result.price}
                mainImage={result.productUrls[0]}
              />
            </Link>
          ))}
      </div>

      <BottomNav />
    </div>
  );
}
