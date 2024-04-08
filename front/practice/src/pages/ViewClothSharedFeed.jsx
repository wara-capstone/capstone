
//import MiniProfile from "../components/MiniProfile.jsx";
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import { Card, CardHeader, Avatar, IconButton, Typography, CardMedia, CardActions } from '@mui/material';
//import MoreVertIcon from '@mui/material/MoreVert';
import {faker} from '@faker-js/faker';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {styled} from '@mui/system';
import { useNavigate } from 'react-router-dom';

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
    const {id, userName, userImg, img, caption} = props;
    //const {id} = useParams();
    //const [itemData, setItemData] = useState(null); 서버에서 데이터 받아올 때

    const itemData = {
        userName: faker.person.fullName(),
        userImg: faker.image.avatar(),
        img: faker.image.url(),
        caption: faker.lorem.text(),
        
    };


  return (
        <Card>
          {/* Header */}
          <StyledCardHeader
                avatar={
                    <Avatar src={itemData.userImg} 
                    aria-label={itemData.userName}>
                    {itemData.userName.charAt(0)}
                    </Avatar>
                }
                title={
                    <TitleTypography variant="body2" fontWeight="bold">
                      {itemData.userName}
                    </TitleTypography>
                  }
                action={
                    <>
                    <IconButton aria-label="like">
                            <FavoriteBorderIcon />
                        </IconButton>
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    </>                
                }            
            />
            {/* Media */}
            <CardMedia component="img" image={itemData.img} alt={itemData.caption}/>
        </Card>
       
    );
}