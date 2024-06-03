import React, {useState, useEffect} from "react";
import { Box, Card, CardHeader, Avatar, CardContent, Typography } from "@mui/material";
import { styled } from '@mui/system';

  // Title 스타일을 위한 컴포넌트
  const TitleTypography = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
  }));
  
function ProductTagListItem({ itemData, onClick, cardSize = {}  }) {
  console.log("상품태그할 때 url를 가져오고 있을까??");
  console.log(itemData.productUrls[0].url);
    const formatPrice = (price) => {
      return `${price}원`;
    };
  
    return (
      <Card sx={{ display: "flex", alignItems: "center", width: cardSize.width, height: cardSize.height }} onClick={onClick}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ width: 80, height: 80 }}
              
              src={itemData.productUrls[0].url}
              variant="rounded"
            ></Avatar>
          }
        />
        <CardContent sx={{ flex: "1 0 auto", paddingLeft: "8px" }}>
          <TitleTypography component="div" variant="body2" fontWeight="bold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" align="left">
            {itemData.productName}
          </TitleTypography>
          <Typography variant="subtitle1" color="text.secondary" component="div" align="left">
            {formatPrice(itemData.price)} 
          </Typography>
        </CardContent>
      </Card>
    );
  }


//   function ImageWithTags({ imageUrl }) {
//     const [tags, setTags] = useState([]);

//     const handleImageClick = (e) => {
//         const rect = e.target.getBoundingClientRect();
//         const x = e.clientX - rect.left; // 클릭된 위치의 X 좌표
//         const y = e.clientY - rect.top; // 클릭된 위치의 Y 좌표

//         // 새 태그를 태그 목록에 추가
//         const newTag = { id: tags.length + 1, x: x, y: y };
//         setTags([...tags, newTag]);
//     };

//     return (
//         <div className="image-container" onClick={handleImageClick} style={{ position: 'relative' }}>
//             <Box
//                 sx={{
//                     width: 300, // 박스의 너비
//                     height: 300, // 박스의 높이
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     overflow: 'hidden',
//                     margin: 'auto' // 중앙 정렬
//                 }}
//             >
//                 <img src={imageUrl} alt="Product" style={{ width: '100%' }} />
//             </Box>
//             {tags.map(tag => (
//                 <div key={tag.id} className="product-tag" style={{ position: 'absolute', left: tag.x, top: tag.y }}>
//                     <ProductTagListItem />
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default ImageWithTags;
export default ProductTagListItem;