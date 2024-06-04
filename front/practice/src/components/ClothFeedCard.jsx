import { Card, CardMedia, CardHeader, Avatar, IconButton, Typography, CardContent } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function ClothFeedCard({ userName, userImg, img, caption, userFeedContent }) {
  return (
    <Card>
      {/* Media */}
      <CardMedia component="img" height="200" image={img} alt={caption} />
      {/* Header */}
      <CardContent>
          <Typography variant="body2" fontWeight="bold"  sx={{ fontSize: "0.88rem", textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1, textAlign: 'left', lineHeight: '1.5', // 이 부분 추가
    height: '1em'}} noWrap>
            {userFeedContent}
          </Typography>
        
        </CardContent>
      <CardHeader
      
        avatar={
          <Avatar src={userImg} aria-label={userName}>
            {userName} Avatar에 userName의 첫 글자를 표시
          </Avatar>
        }
        action={
          <>
            <IconButton aria-label="like">
              <FavoriteBorderIcon />
            </IconButton>         
          </>
        }
        title={
          <Typography color="text.secondery" sx={{ fontSize: "0.85rem", mr: 1 }} noWrap>
            {userName}
          </Typography>
        }
        
        sx={{ paddingBottom: "5px", paddingTop: "5px" }} // CardHeader의 높이를 낮추기 위해 패딩 조정
      />
    </Card>
  );
}

export default ClothFeedCard;