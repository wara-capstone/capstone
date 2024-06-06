import {
  Avatar,
  Box,
  Button,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  Modal,
  Card as MuiCard,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card";
import Header from "../components/Header";
// 아이콘
import Slider from "react-slick"; // react-slick 사용을 위해 import
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import CommentIcon from "@mui/icons-material/Comment";
import CardContent from "@mui/material/CardContent";
import LikeButton from "../components/LikeButton";
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
  const [token, setToken] = useState("");
  const userEmail = localStorage.getItem("email");
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);
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
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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

  const handleCommentModal = () => {
    setShowCommentModal(!showCommentModal);
  };

  const handleCommentTextChange = (event) => {
    setCommentText(event.target.value);
  };
  // 댓글 내용 서버로 보내는 코드
  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.NODE_ENV === "development" ? "" : ""}${
          process.env.REACT_APP_API_URL
        }user-feed/like/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userFeedId: id,
            userEmail: userEmail,
            content: commentText,
          }),
        }
      );

      if (response.ok) {
        // 댓글 전송 성공 시 처리 로직
        console.log("댓글이 성공적으로 전송되었습니다.");
        setCommentsList([...commentsList, commentText]); // 새로운 댓글 추가
        setCommentText(""); // 입력 필드 초기화
        handleCommentModal(); // 모달 창 닫기
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

      <Slider {...sliderSettings}>
        {itemData.product &&
          itemData.product.map((result, index) => {
            return (
              <Link
                to={`/item/${result.productId}`}
                key={result.productId}
                className="card-link"
              >
                <Card
                  key={index}
                  title={result.productName}
                  // subTitle={result.productCategory}
                  price={result.productPrice}
                  mainImage={result.productImage}
                  // count={result.options[0].productStock}
                />
              </Link>
            );
          })}
      </Slider>

      <Box
        sx={{
          backgroundColor: "white",
          padding: "16px",
        }}
      >
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

          <LikeButton
            id={id}
            // userEmail={userEmail}
            // likedByMe={likedByMe}
            // likesCount={likesCount}
            // setLikedByMeState={setLikedByMe}
            // setLikesCountState={setLikesCount}
          />

          <Box
            sx={{
              backgroundColor: "white",
              padding: "16px",
            }}
          >
            <IconButton aria-label="Comment" onClick={handleCommentModal}>
              <CommentIcon />
            </IconButton>
          </Box>
          {showCommentModal && (
            <Modal
              open={showCommentModal}
              onClose={handleCommentModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  댓글 작성
                </Typography>
                <TextField
                  id="comment-input"
                  label="댓글 입력"
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  sx={{ mt: 2 }}
                  value={commentText}
                  onChange={handleCommentTextChange}
                />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button variant="contained" onClick={handleCommentSubmit}>
                    작성
                  </Button>
                </Box>
              </Box>
            </Modal>
          )}
        </Box>
        <CardContent>
          <Typography variant="subtitle1" color="text" textAlign="left">
            {itemData.userFeedContent}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </CardContent>
      </Box>

      <BottomNav />
    </div>
  );
}
