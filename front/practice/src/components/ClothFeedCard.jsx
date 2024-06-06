import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchRefreshToken } from "../utils/authUtil";
import LikeButton from "./LikeButton";
function ClothFeedCard({
  id,
  userName,
  userImg,
  img,
  caption,
  userFeedContent,
}) {
  const [likedByMe, setLikedByMe] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const userEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  // 서버에서 조회하여 좋아요 수와 좋아요 상태를 가져옴
  useEffect(() => {
    console.log("id 조회 가능?", id, userEmail);
    const fetchLikeData = async () => {
      try {
        const response = await fetch(
          `${process.env.NODE_ENV === "development" ? "" : ""}${
            process.env.REACT_APP_API_URL
          }user-feed`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          console.log("GET 요청 성공");
          const data = await response.json();
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
  }, [id]);

  const handleLike = async () => {
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
        const data = await response.json();
        console.log("Server response:", data);

        // 좋아요 상태 토글
        setLikedByMe(!likedByMe);

        // 좋아요 개수 업데이트
        setLikesCount(data.likesCount);
      } else {
        console.error("Error liking post:", response.status);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <Card>
      {/* Media */}
      <CardMedia component="img" height="200" image={img} alt={caption} />
      {/* Header */}
      {/* <CardContent>
          <Typography variant="body2" fontWeight="bold"  sx={{ fontSize: "0.88rem", textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1, textAlign: 'left', // 이 부분 추가
    height: '1.5em'}} noWrap>
            {userFeedContent}
          </Typography>
        
        </CardContent> */}
      <CardHeader
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "5px",
          paddingTop: "5px",
        }}
        avatar={
          <Box
            sx={{ display: "flex", alignItems: "center", marginLeft: "-8px" }}
          >
            <Avatar
              src={userImg}
              aria-label={userName}
              sx={{ width: 36, height: 36, marginRight: "5px" }}
            >
              <Typography sx={{ fontSize: "0.875rem" }}>
                {userName[0]}
              </Typography>
            </Avatar>
            <Typography
              color="text.secondery"
              sx={{ fontSize: "0.85rem", textAlign: "left" }}
              noWrap
            >
              {userName}
            </Typography>
          </Box>
        }
        action={<LikeButton id={id} />}
      />
    </Card>
  );
}

export default ClothFeedCard;
