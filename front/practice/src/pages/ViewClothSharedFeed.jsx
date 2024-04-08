
import MiniProfile from "../components/MiniProfile.jsx";
import { Card, CardHeader, Avatar, IconButton, Typography, CardMedia, CardActions } from '@mui/material';
//import MoreVertIcon from '@mui/material/MoreVert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useNavigate } from 'react-router-dom';

export default function ViewClothSharedFeed({id, userName, userImg, img, caption}) {
    
  return (
        <Card>
          {/* Header */}
          <CardHeader
                avatar={
                    <Avatar src={userImg} aria-label={userName}>
                        {userName.charAt(0)} {/* Avatar에 userName의 첫 글자를 표시 */}
                    </Avatar>
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
                title={<Typography fontWeight="bold">{userName}</Typography>  
            }    
            />
            {/* Media */}
            <CardMedia component="img" image={img} alt={caption}/>
        </Card>
       
    );
}