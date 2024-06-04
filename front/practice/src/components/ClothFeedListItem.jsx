import { Avatar, Card, CardHeader, CardMedia, Typography } from "@mui/material";
import React from "react";
//import MoreVertIcon from '@mui/material/MoreVert';

// props 객체를 인자로 받아 구조 분해 할당을 통해 필요한 속성을 추출합니다.
function ClothFeedListItem({ id, userName, userImg, img, caption }) {
  console.log(userName); // 이제 userName은 문자열로 콘솔에 출력됩니다.

  return (
    <div className="ClothFeedListItem">
      <Card>
        {/* Media */}
        <CardMedia component="img" height="200" image={img} alt={caption} />
        {/* Header */}
        <CardHeader
          avatar={
            <Avatar src={userImg} aria-label={userName}>
              {userName.charAt(0)} {/* Avatar에 userName의 첫 글자를 표시 */}
            </Avatar>
          }
          action={
            <>
              {/* <IconButton aria-label="like">
                            <FavoriteBorderIcon />
                        </IconButton>
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton> */}
            </>
          }
          title={
            <Typography fontWeight="bold" sx={{ fontSize: "0.85rem" }}>
              {userName}
            </Typography>
          }
          sx={{ paddingBottom: "5px", paddingTop: "5px" }} // CardHeader의 높이를 낮추기 위해 패딩 조정
        />
      </Card>
    </div>
  );
}

export default ClothFeedListItem;
