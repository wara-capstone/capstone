import React, { useRef, useState } from "react";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

import { BiSort } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";

export default function Search() {
  const [searchText, setSearchText] = useState(""); // 검색창 값

  function myFunction(event) {
    event.preventDefault();
    console.log(searchText);
  }

  const [searchResultCount, setSearchResultCount] = useState(0); // 검색 결과 개수 상태

  // 검색 결과를 받아올 때마다 검색 결과 개수 업데이트
  const updateSearchResultCount = (resultCount) => {
    setSearchResultCount(resultCount);
  };

  const [sortText, setSortText] = useState("낮은가격순"); // 정렬 텍스트 상태
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
        {searchResultCount === 0 && (
          <h3 className="no-result">
            검색 결과가 없습니다. <br />
            다른 검색어로 검색해보세요.
          </h3>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
