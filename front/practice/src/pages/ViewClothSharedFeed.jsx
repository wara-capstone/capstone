
//import MiniProfile from "../components/MiniProfile.jsx";
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import { Card, CardHeader, Avatar, IconButton, Typography, CardMedia, Box, CardActions } from '@mui/material';
//import MoreVertIcon from '@mui/material/MoreVert';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IosShareIcon from '@mui/icons-material/IosShare';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import {styled} from '@mui/system';
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import ProductTagListItem from '../components/ProductTagListItem';
const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    // 스타일 커스터마이징 추가
  }));
  
  // Title 스타일을 위한 컴포넌트
  const TitleTypography = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginLeft: '8px' // 필요에 따라 조정
  }));


export default function ViewClothSharedFeed(props) {
    //const {id, userName, userImg, img, caption} = props;
    const {id} = useParams();
    const [itemData, setItemData] = useState(null); //서버에서 데이터 받아올 때

    useEffect(() => {
      // 서버에서 데이터를 비동기적으로 가져오는 함수
      const fetchItemData = async () => {
        try {
          // 서버 URL을 적절히 변경하세요
          const response = await fetch(`https://example.com/api/posts/${id}`);
          if (!response.ok) {
            throw new Error("Something went wrong");
          }
          const data = await response.json();
          setItemData(data); // 가져온 데이터를 상태로 설정
        } catch (error) {
          console.error("Failed to fetch item data:", error);
        }
      };
  
      fetchItemData();
    }, [id]);
  
    if (!itemData) {
      // 데이터를 가져오는 동안 로딩 상태 표시
      return <div>Loading...</div>;
    }


  return (
    <div className="ViewClothSharedFeed">
        <Header />
        <Card>
          {/* Header */}
          <StyledCardHeader
                avatar={
                    <Avatar src={itemData.userImg} 
                    aria-label={itemData.userName}>
                    {itemData.userName.charAt(0)}
                    </Avatar>
                }
                
                action={
                    <>
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    </>                
                }
                title={
                    <TitleTypography variant="body2" fontWeight="bold">
                      {itemData.userName}
                    </TitleTypography>
                  }            
            />
            {/* Media */}
            <CardMedia component="img" image={itemData.img} 
             sx = {{width: 400, height:500}} alt={itemData.caption}/>
        </Card>
        <ProductTagListItem />
        <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between', // 좌우 여백을 최대로 하여 아이콘들을 양쪽 끝으로 분리
        alignItems: 'center', // 아이콘들을 상하 중앙 정렬
        width: '100%', // 박스의 너비를 부모 컴포넌트에 맞춤
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

        <BottomNav />
    </div>
    );
}