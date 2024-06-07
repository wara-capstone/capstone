import React, { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchRefreshToken } from "../utils/authUtil";
import Card from "./Card";
import "./Category.css";

import belt from "../adImages/categoryIconImage/belt.png";
import bottom from "../adImages/categoryIconImage/bottom.png";
import etc from "../adImages/categoryIconImage/etc.png";
import outer from "../adImages/categoryIconImage/outer.png";
import shoes from "../adImages/categoryIconImage/shoes.png";
import top from "../adImages/categoryIconImage/top.png";

import { BiSort } from "react-icons/bi";

const Category = ({ storeId }) => {
  // const [selectedCategory, setSelectedCategory] = useState(null);
  let token = localStorage.getItem("token");
  const RefreshToken = localStorage.getItem("RefreshToken");

  const [searchResultCount, setSearchResultCount] = useState(0); // 검색 결과 개수 상태
  const [sortText, setSortText] = useState("낮은가격순"); // 정렬 텍스트 상태
  const [sortType, setSortType] = useState("ASC"); // 정렬 타입 상태
  const [sortCondition, setSortCondition] = useState("PRICE"); // 정렬 조건 상태
  const [searchText, setSearchText] = useState("상의"); // 검색창 값
  const [searchData, setSearchData] = useState(null); // 상태 추가

  const handleCategoryClick = (category) => {
    console.log(category);
    setSearchText(category);
  };

  useEffect(() => {
    // const encodedSearchText = encodeURIComponent(searchText);

    let sortUrl;

    if (storeId) {
      sortUrl = `${process.env.NODE_ENV === "development" ? "" : ""}${
        process.env.REACT_APP_API_URL
      }product/all/sort/${sortCondition}/${sortType}/${searchText}/${storeId}/0`;
    } else {
      sortUrl = `${process.env.NODE_ENV === "development" ? "" : ""}${
        process.env.REACT_APP_API_URL
      }product/all/sort/${sortCondition}/${sortType}/${searchText}/0`;
    }

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
        console.log(sortUrl);
        console.log("검색 결과가 없습니다.");
        setSearchData(null);
        setSearchResultCount(0);
      }

      if (response.status === 200) {
        const data = await response.json(); // response.json()이 완료될 때까지 기다림

        setSearchData(data); // 상태 업데이트

        console.log(sortUrl);
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
  }, [searchText, sortType, storeId]);

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태

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
      setSortCondition("PRICE");
    } else if (sortText === "높은가격순") {
      setSortType("DESC");
      setSortCondition("PRICE");
    } else if (sortText === "최신등록순") {
      setSortType("ASC");
      setSortCondition("LATEST");
    }
  }, [sortText]);
  return (
    <div className="category-container-include-items">
      <div className="category-container">
        <div className="category-row">
          <div
            className="category-item"
            onClick={() => handleCategoryClick("상의")}
          >
            <img src={top} style={{ width: "40px", height: "40px" }} />
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>상의</span>
            {/* <FaTshirt size={20} /> <br /> 상의 */}
          </div>
          <div
            className="category-item"
            onClick={() => handleCategoryClick("하의")}
          >
            <img src={bottom} style={{ width: "40px", height: "40px" }} />
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>하의</span>
            {/* <PiPantsFill size={20} /> <br /> 하의 */}
          </div>
          <div
            className="category-item"
            onClick={() => handleCategoryClick("아우터")}
          >
            <img src={outer} style={{ width: "40px", height: "40px" }} />
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>아우터</span>
            {/* <GiPirateCoat size={20} /> <br /> 아우터 */}
          </div>
        </div>
        <div className="category-row">
          <div
            className="category-item"
            onClick={() => handleCategoryClick("신발")}
          >
            <img src={shoes} style={{ width: "40px", height: "40px" }} />
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>신발</span>
            {/* <GiConverseShoe size={20} /> <br /> 신발 */}
          </div>
          <div
            className="category-item"
            onClick={() => handleCategoryClick("잡화")}
          >
            <img src={belt} style={{ width: "40px", height: "40px" }} />
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>잡화</span>
            {/* <GiBelt size={20} /> <br /> 잡화 */}
          </div>
          <div
            className="category-item"
            onClick={() => handleCategoryClick("기타")}
          >
            <img src={etc} style={{ width: "40px", height: "40px" }} />
            <br />
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>기타</span>
            {/* <FiMoreHorizontal size={20} /> <br /> 기타 */}
          </div>
        </div>
      </div>

      {/* 선택된 카테고리가 없을 때 보여줄 추천 상품 */}
      {/* {!selectedCategory && (
        <CardList category={selectedCategory} url={`${allUrl}`} />
      )} */}
      {/* 선택된 카테고리에 따라 다른 CardList를 보여줍니다. */}
      {/* {selectedCategory && (
        <CardList
          category={selectedCategory}
          url={`${categoryUrl}${selectedCategory}`}
        />
      )} */}

      <div className="category-search" onClick={handleOutsideClick}>
        <div className="category-search-item">
          <div className="category-search-item-num">
            <span style={{ fontSize: "15px" }}>전체&nbsp;</span>
            <span style={{ fontSize: "15px", color: "#336699" }}>
              {searchResultCount}
            </span>
            <span style={{ fontSize: "15px" }}>건</span>
          </div>

          <div className="category-search-item-sort" onClick={handleSortClick}>
            <span style={{ fontSize: "15px" }}>{sortText}</span>
            <BiSort style={{ color: "#336699" }} />
          </div>
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="category-modal-background" onClick={handleOutsideClick}>
          <div className="modal" ref={modalRef}>
            <div className="category-modal-content">
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
                {sortText === "낮은가격순" && (
                  <FaCheck style={{ color: "#336699" }} />
                )}
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
                {sortText === "높은가격순" && (
                  <FaCheck style={{ color: "#336699" }} />
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "13px", // 텍스트 간의 간격 설정
                  borderBottom: "2px solid #f0f0f0", // 구분선 추가
                }}
                onClick={() => handleOptionSelect("최신등록순")}
              >
                <div
                  style={{
                    fontWeight: sortText === "최신등록순" ? "bold" : "normal",
                    fontSize: "18px",
                  }}
                >
                  최신등록순
                </div>
                {sortText === "최신등록순" && (
                  <FaCheck style={{ color: "#336699" }} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card-list">
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
    </div>
  );
};

export default Category;
