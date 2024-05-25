import React, {useState, useEffect} from "react";
import { Box, Card, CardHeader, Avatar, CardContent, Typography } from "@mui/material";
import { styled } from '@mui/system';
import { fetchRefreshToken } from "../utils/authUtil";
import { message }from "antd";
import { faker } from "@faker-js/faker";
  // Title 스타일을 위한 컴포넌트
  const TitleTypography = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
  }));
  
function ProductTagListItem({ onClick }) {
    const [itemData, setItemData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [purchaseItems, setPurchaseItems] = useState([]);
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${process.env.NODE_ENV === 'development' ? 'http://' : ''}${process.env.REACT_APP_API_URL}/payment/read/user/${userEmail}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
              },
            }
          );
  
          if (response.status === 401) {
            const RefreshToken = localStorage.getItem("RefreshToken");
            await fetchRefreshToken(RefreshToken);
            const newToken = localStorage.getItem("token");
            // 토큰 갱신 후 재요청
            const retryResponse = await fetch(
              `${process.env.NODE_ENV === 'development' ? 'http://' : ''}${process.env.REACT_APP_API_URL}/payment/read/user/${userEmail}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `${newToken}`
                },
              }
            );
            if (!retryResponse.ok) {
              throw new Error('데이터를 불러오는데 실패했습니다.');
            }
            const result = await retryResponse.json();
            handleResponse(result);
          } else if (response.status === 200) {
            const result = await response.json();
            handleResponse(result);
          } else {
            message.error("구매 내역을 불러오는데 실패하였습니다.", 1);
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
          message.error("데이터를 불러오는데 실패했습니다.", 1);
        }
      };
  
      const handleResponse = async (result) => {
        if (result.result === "success") {
          console.log("구매 내역이 존재합니다.");
          result.data.forEach(data => {
            setTotalPrice(totalPrice => totalPrice += data.totalPrice);
  
            data.paymentDTOS.forEach(async payment => {
              const productId = payment.productId;
              const optionId = payment.optionId;
  
              const response2 = await fetch(
                `${process.env.NODE_ENV === 'development' ? 'http://' : ''}${process.env.REACT_APP_API_URL}/product/all/${productId}/option/${optionId}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                  },
                }
              );
  
              if (response2.status === 200) {
                const productResult = await response2.json();
                productResult["quantity"] = payment.quantity;
                productResult["price"] = payment.price;
                setPurchaseItems(prevItems => [...prevItems, productResult]);
              } else {
                console.log("상품 정보를 불러오는데 실패했습니다.");
              }
            });
          });
        } else {
          message.success("구매 내역이 존재하지 않습니다!");
        }
      };
  
      fetchData();
    }, [token, userEmail]);
  
    if (purchaseItems.length === 0) {
      return <div>데이터 로딩중...</div>;
    }
  
    const formatPrice = (price) => {
      return `${price.toLocaleString()}원`;
    };
  
    return (
      <Card sx={{ display: "flex", alignItems: "center" }} onClick={onClick}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ width: 80, height: 80 }}
              src={itemData.userImg}
              variant="rounded"
            ></Avatar>
          }
        />
        <CardContent sx={{ flex: "1 0 auto", paddingLeft: "8px" }}>
          <TitleTypography component="div" variant="body2" fontWeight="bold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" align="left">
            {itemData.productName}
          </TitleTypography>
          <Typography variant="subtitle1" color="text.secondary" component="div" align="left">
            {formatPrice(itemData.productPrice)}
          </Typography>
        </CardContent>
      </Card>
    );
  }


  function ImageWithTags({ imageUrl }) {
    const [tags, setTags] = useState([]);

    const handleImageClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left; // 클릭된 위치의 X 좌표
        const y = e.clientY - rect.top; // 클릭된 위치의 Y 좌표

        // 새 태그를 태그 목록에 추가
        const newTag = { id: tags.length + 1, x: x, y: y };
        setTags([...tags, newTag]);
    };

    return (
        <div className="image-container" onClick={handleImageClick} style={{ position: 'relative' }}>
            <Box
                sx={{
                    width: 300, // 박스의 너비
                    height: 300, // 박스의 높이
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    margin: 'auto' // 중앙 정렬
                }}
            >
                <img src={imageUrl} alt="Product" style={{ width: '100%' }} />
            </Box>
            {tags.map(tag => (
                <div key={tag.id} className="product-tag" style={{ position: 'absolute', left: tag.x, top: tag.y }}>
                    <ProductTagListItem />
                </div>
            ))}
        </div>
    );
}

export default ImageWithTags;