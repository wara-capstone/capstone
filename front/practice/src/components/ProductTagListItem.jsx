import React from "react";
import { Card, CardHeader, Avatar, CardContent, Typography } from "@mui/material";
import { styled } from '@mui/system';
import { faker } from "@faker-js/faker";
  // Title 스타일을 위한 컴포넌트
  const TitleTypography = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
  }));
  
  export default function ProductTagListItem({ onClick }) {
    const itemData = {
      userName: faker.person.fullName(),
      productName: faker.commerce.productName(),
      productPrice: faker.commerce.price({ min: 100000, max: 500000 }),
      userImg: faker.image.avatar(),
      img: faker.image.url(),
      caption: faker.lorem.text(),
    };
  
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
