import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const LikeButton = ({
  id,
  userEmail,
  // likedByMe,
  // likesCount,
  // setLikedByMeState,
  // setLikesCountState,
}) => {
  const [likedByMe, setLikedByMe] = useState(false);
  // const [likedByMeState, setLikedByMeState] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  let token = localStorage.getItem("token");

  // 서버에서 조회하여 좋아요 수와 좋아요 상태를 가져옴
  useEffect(() => {
    console.log("feedId 조회 가능?", id, userEmail);

    const fetchLikeData = async () => {
      try {
        const response = await fetch(
          `${process.env.NODE_ENV === "development" ? "" : ""}${
            process.env.REACT_APP_API_URL
          }user-feed/${id}?email=${userEmail}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        if (response.ok) {
          console.log("GET 요청 성공");
          const data = await response.json();
          console.log(
            "좋아요 상태와 수",
            data.productId,
            data.likedByMe,
            data.likesCount
          );
          setLikedByMe(data.likedByMe);
          setLikesCount(data.likesCount);
        } else {
          console.error("Error fetching like data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching like data:", error);
      }
    };

    fetchLikeData();
  }, [id, userEmail, likedByMe]);

  const handleLike = async () => {
    // setLikedByMe(!likedByMe);
    // setLikesCount(likedByMe ? likesCount - 1 : likesCount + 1);

    if (!userEmail) {
      // userEmail이 없을 경우, 함수 실행을 중지합니다.
      return;
    }
    // userEmail이 있을 경우, 여기에 좋아요/좋아요 취소 로직을 구현합니다.
    // 예를 들어, 상태를 업데이트하거나 API 요청을 보내는 등의 작업을 수행합니다.

    try {
      const response = await fetch(
        `${process.env.NODE_ENV === "development" ? "" : ""}${
          process.env.REACT_APP_API_URL
        }user-feed/like/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            userEmail: userEmail,
            userFeedId: id,
          }),
        }
      );

      if (response.ok) {
        console.log("POST 요청 성공");
        setLikedByMe(!likedByMe);
        setLikesCount(likedByMe ? likesCount - 1 : likesCount + 1);
        // setLikesCountState(likedByMe ? likesCount - 1 : likesCount + 1);
      } else {
        console.error("Error liking post:", response.status);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton
        aria-label={likedByMe ? "좋아요 취소" : "좋아요"}
        // color={likedByMe ? "white" : "default"}
        onClick={handleLike}
        sx={{ width: 40, height: 40, color: likedByMe ? "red" : "default" }}
      >
        {likedByMe ? (
          <FavoriteIcon fontSize="small" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        )}
      </IconButton>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: "0.65rem" }}
      >
        {likesCount}
      </Typography>
    </Box>
  );
};

export default LikeButton;
