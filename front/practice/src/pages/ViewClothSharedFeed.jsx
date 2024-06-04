import {
  Avatar,
  Box,
  CardHeader,
  CardMedia,
  IconButton,
  Card as MuiCard,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card";
import Header from "../components/Header";
// 아이콘
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IosShareIcon from "@mui/icons-material/IosShare";
import Slider from "react-slick"; // react-slick 사용을 위해 import
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  // 스타일 커스터마이징 추가
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginLeft: "8px", // 필요에 따라 조정
}));

export default function ViewClothSharedFeed() {
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const url =
    `${process.env.NODE_ENV === "development" ? "" : ""}${
      process.env.REACT_APP_API_URL
    }user-feed/` + id;

  const sliderSettings = {
    className: "center",

    centerMode: true,
    infinite: true,
    dots: true,
    arrows: false,

    centerPadding: "43px",

    slidesToShow: 1,
    slidesToScroll: 1,

    speed: 500,
    beforeChange: (current, next) => setCurrentSlide(next), // 슬라이드 변경 시 현재 슬라이드 인덱스 업데이트
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setItemData(data);
        console.log(data);
      } else {
        console.log("실패");
      }
    };

    fetchData();
  }, [id]);

  if (!itemData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ViewClothSharedFeed">
      <Header />
      <MuiCard>
        <StyledCardHeader
          avatar={
            <Avatar
              src={itemData.user.userImage}
              aria-label={itemData.user.userName}
            >
              {itemData.user.userName.charAt(0)}
            </Avatar>
          }
          title={
            <TitleTypography variant="body2" fontWeight="bold">
              {itemData.user.userName}
            </TitleTypography>
          }
        />
        <CardMedia
          component="img"
          image={itemData.userFeedImage}
          sx={{ width: 390, height: 500 }}
          alt={itemData.caption}
        />
      </MuiCard>

      {/*  */}
      {/*  */}
      {/*  */}
      {/* 이 놈이 문제임 */}
      {/* <ProductTagListItem itemData={itemData} /> */}
      {/* 이 놈 필요 없음 */}
      {/*  */}
      {/*  */}
      {/*  */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // 좌우 여백을 최대로 하여 아이콘들을 양쪽 끝으로 분리
          alignItems: "center", // 아이콘들을 상하 중앙 정렬
          width: "100%", // 박스의 너비를 부모 컴포넌트에 맞춤
        }}
      >
        {/* 왼쪽 아이콘 */}
        <IconButton aria-label="share">
          <IosShareIcon />
        </IconButton>

        {/* 오른쪽 아이콘들을 감싸는 박스 */}
        <Box>
          <IconButton aria-label="like">
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton aria-label="bookMark">
            <BookmarkBorderIcon />
          </IconButton>
        </Box>
      </Box>

      <Slider {...sliderSettings}>
        {itemData.product &&
          itemData.product.map((result, index) => {
            const isActive = index === currentSlide; // 현재 슬라이드 인덱스와 일치하는지 확인

            return (
              <Link
                to={`/item/${result.productId}`}
                key={result.productId}
                // className="card-link"
                className={`card-link ${isActive ? "active-slide" : ""}`} // 현재 슬라이드에 클래스 추가
              >
                <Card
                  key={index}
                  title={result.productName}
                  // subTitle={result.productCategory}
                  price={result.productPrice}
                  mainImage={result.productImage}
                  // count={result.options[0].productStock}
                  // specialStyle="special-card" // 여기서 다른 스타일 클래스 적용
                  specialStyle={
                    isActive ? "special-card-active" : "special-card"
                  } // 현재 슬라이드에 다른 스타일 적용
                />
              </Link>
            );
          })}
      </Slider>

      <BottomNav />
    </div>
  );
}
