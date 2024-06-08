import {
  Avatar,
  Box,
  CardHeader,
  CardMedia,
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
import CardContent from "@mui/material/CardContent";
import Slider from "react-slick"; // react-slick 사용을 위해 import
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Comment from "../components/Comment";
import "../components/Comment.css";
import LikeButton from "../components/LikeButton";
import { formatCreatedAt } from "../utils/dateUtils";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  // 스타일 커스터마이징 추가
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginLeft: "8px", // 필요에 따라 조정
}));

export default function ViewClothSharedFeed() {
  // const [id, setId] = useState('');
  const token = sessionStorage.getItem("token");
  const userEmail = sessionStorage.getItem("email");
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [comments, setComments] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  // const [likedByMe, setLikedByMe] = useState(false);
  // const [likesCount, setLikesCount] = useState(0);

  // 좋아요 요청 보내기

  const url =
    `${process.env.NODE_ENV === "development" ? "" : ""}${
      process.env.REACT_APP_API_URL
    }user-feed/` + id;

  const sliderSettings = {
    className: "center",

    centerMode: true,
    infinite: true,
    //infinite: itemData.product.length > 1, // 카드가 하나일 때 반복되지 않도록 설정

    dots: true,
    arrows: false,

    centerPadding: "30px",

    slidesToShow: 1,
    slidesToScroll: 1,

    speed: 500,
    beforeChange: (current, next) => setCurrentSlide(next), // 슬라이드 변경 시 현재 슬라이드 인덱스 업데이트
  };

  useEffect(() => {
    console.log("feedId 조회 가능?", id, userEmail);

    const fetchData = async () => {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (response.status === 200) {
        // const RefreshToken = sessionStorage.getItem("RefreshToken");
        // await fetchRefreshToken(RefreshToken);
        const data = await response.json();

        if (buttonClicked) {
          setCommentsList(data.comments);
        }
        setItemData(data);
        console.log(data);
      } else {
        console.log("실패");
      }
    };

    if (buttonClicked) {
      fetchData();
    }
    fetchData();
  }, [buttonClicked]);

  if (!itemData) {
    return <div>Loading...</div>;
  }

  // const handleCommentModal = () => {
  //   setShowCommentModal(!showCommentModal);
  // };

  // const handleCommentTextChange = (event) => {
  //   setCommentText(event.target.value);
  // };
  // 댓글 내용 서버로 보내는 코드

  const handleCommentSubmit = async (newComment) => {
    try {
      setButtonClicked(true);
      const response = await fetch(
        `${process.env.NODE_ENV === "development" ? "" : ""}${
          process.env.REACT_APP_API_URL
        }user-feed/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            userFeedId: id,
            userEmail: userEmail,
            content: newComment,
          }),
        }
      );

      if (response.ok) {
        // const RefreshToken = sessionStorage.getItem("RefreshToken");
        // await fetchRefreshToken(RefreshToken);
        // 댓글 전송 성공 시 처리 로직
        console.log("댓글이 성공적으로 전송되었습니다.");
        //setCommentsList([...commentsList, { content: commentText }]); // 새로운 댓글 추가
        // 댓글 목록에 새로운 댓글 추가
        //setComments([...comments, newComment]);
        setCommentsList([...commentsList, newComment]);
      } else {
        // 댓글 전송 실패 시 처리 로직
        console.error("댓글 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 전송 중 오류가 발생했습니다:", error);
    }
  };

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

      {itemData.product.length > 1 ? (
        <Slider {...sliderSettings}>
          {itemData.product &&
            itemData.product.map((result, index) => {
              const isActive = index === currentSlide; // 현재 슬라이드 인덱스와 일치하는지 확인

              return (
                <Link
                  to={`/item/${result.productId}`}
                  key={result.productId}
                  className={`card-link ${isActive ? "active-slide" : ""}`} // 현재 슬라이드에 클래스 추가
                >
                  <Card
                    key={index}
                    title={result.productName}
                    // subTitle={result.productCategory}
                    price={result.productPrice}
                    mainImage={result.productImage}
                    // count={result.options[0].productStock}
                    specialStyle={
                      isActive ? "special-card-active" : "special-card"
                    } // 현재 슬라이드에 다른 스타일 적용
                  />
                </Link>
              );
            })}
        </Slider>
      ) : (
        itemData.product &&
        itemData.product.map((result, index) => {
          const isActive = index === currentSlide; // 현재 슬라이드 인덱스와 일치하는지 확인

          return (
            <Link
              to={`/item/${result.productId}`}
              key={result.productId}
              className={`card-link ${isActive ? "active-slide" : ""}`} // 현재 슬라이드에 클래스 추가
            >
              <Card
                key={index}
                title={result.productName}
                // subTitle={result.productCategory}
                price={result.productPrice}
                mainImage={result.productImage}
                // count={result.options[0].productStock}
                specialStyle={isActive ? "special-card-active" : "special-card"} // 현재 슬라이드에 다른 스타일 적용
              />
            </Link>
          );
        })
      )}

      {/* <Box
        sx={{
          backgroundColor: "white",
          padding: "16px",
        }}
      > */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // 좌우 여백을 최대로 하여 아이콘들을 양쪽 끝으로 분리
          alignItems: "center", // 아이콘들을 상하 중앙 정렬
          width: "100%", // 박스의 너비를 부모 컴포넌트에 맞춤
        }}
      >
        {/* 왼쪽 아이콘 */}

        {/* 오른쪽 아이콘들을 감싸는 박스 */}
      </Box>
      <Box
        sx={{
          backgroundColor: "white",
          padding: "16px",
        }}
      >
        <LikeButton id={id} userEmail={userEmail} />
        <CardContent>
          <Typography variant="subtitle1" color="text" textAlign="left">
            {itemData.userFeedContent}
          </Typography>
          {/* <Divider sx={{ my: 2 }} /> */}
        </CardContent>
        {/* 댓글 작성 표시 */}
      </Box>
      <div>
        {/* 다른 게시물 관련 UI */}
        <Comment onCommentSubmit={handleCommentSubmit} />
        {/* 댓글 목록 렌더링 */}
        {comments.map((comment, index) => (
          <div key={index}>{comment}</div>
        ))}
        {commentsList.map((comment, index) => (
          <Box key={index} className="comment-box">
            <Box className="comment-content">
              <Typography
                variant="body2"
                color="text"
                className="comment-user-name"
                mr={2}
                fontWeight="bold"
                marginLeft={"0.5rem"}
              >
                {comment.userName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="comment-text"
              >
                {comment.content}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              className="comment-created-at"
              marginLeft={"0.5rem"}
              marginRight={"0.3rem"}
              lineHeight={1.5}
              fontSize={"0.7rem"}
            >
              {formatCreatedAt(comment.createdAt)}
            </Typography>
          </Box>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
