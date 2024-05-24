//import MiniProfile from "../components/MiniProfile.jsx";
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";
//import MoreVertIcon from '@mui/material/MoreVert';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IosShareIcon from '@mui/icons-material/IosShare';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import {styled} from '@mui/system';
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import ProductTagListItem from "../components/ProductTagListItem";
const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  // 스타일 커스터마이징 추가
}));

// Title 스타일을 위한 컴포넌트
const TitleTypography = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginLeft: "8px", // 필요에 따라 조정
}));

export default function ViewClothSharedFeed(props) {
  const { id, userName, userImg, img, caption } = props;
  //const {id} = useParams();
  //const [itemData, setItemData] = useState(null); 서버에서 데이터 받아올 때

  const itemData = {
    userName: faker.person.fullName(),
    userImg: faker.image.avatar(),
    img: faker.image.url(),
    caption: faker.lorem.text(),
  };

  return (
    <div className="ViewClothSharedFeed">
      <Header />
      <Card>
        {/* Header */}
        <StyledCardHeader
          avatar={
            <Avatar src={itemData.userImg} aria-label={itemData.userName}>
              {itemData.userName.charAt(0)}
            </Avatar>
          }
          action={
            <>
              {/* <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton> */}
            </>
          }
          title={
            <TitleTypography variant="body2" fontWeight="bold">
              {itemData.userName}
            </TitleTypography>
          }
        />
        {/* Media */}
        <CardMedia
          component="img"
          image={itemData.img}
          sx={{ width: 500, height: 700 }}
          alt={itemData.caption}
        />
      </Card>
      <ProductTagListItem />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // 좌우 여백을 최대로 하여 아이콘들을 양쪽 끝으로 분리
          alignItems: "center", // 아이콘들을 상하 중앙 정렬
          width: "100%", // 박스의 너비를 부모 컴포넌트에 맞춤
        }}
      >
        {/* 왼쪽 아이콘 */}
        {/* <IconButton aria-label="share">
          <IosShareIcon />
        </IconButton> */}

        {/* 오른쪽 아이콘들을 감싸는 박스 */}
        {/* <Box>
          <IconButton aria-label="like">
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton aria-label="bookMark">
            <BookmarkBorderIcon />
          </IconButton>
        </Box> */}
      </Box>

      <BottomNav />
    </div>
  );
}
