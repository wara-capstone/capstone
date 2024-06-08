import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import LikeButton from "./LikeButton";
function ClothFeedCard({
  id,
  userName,
  userImg,
  img,
  caption,
  userFeedContent,
}) {
  const userEmail = localStorage.getItem("email");

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
        action={<LikeButton id={id} userEmail={userEmail} />}
      />
    </Card>
  );
}

export default ClothFeedCard;
