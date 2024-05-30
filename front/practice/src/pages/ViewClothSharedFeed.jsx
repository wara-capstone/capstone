import {
  Avatar,
  CardHeader,
  CardMedia,
  Card as MuiCard,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card";
import Header from "../components/Header";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  // 스타일 커스터마이징 추가
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginLeft: "8px", // 필요에 따라 조정
}));

export default function ViewClothSharedFeed() {
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://101.101.216.115:21000/api/user-feed/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setItemData(data);
        console.log(data);
      } else {
        console.log("실패");
      }
    };

    fetchData();
  }, [id]);

  if (!itemData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ViewClothSharedFeed" style={{ backgroundColor: "#f2f2f2" }}>
      <Header />
      <MuiCard>
        <StyledCardHeader
          avatar={
            <Avatar
              src={itemData.user.userImage}
              aria-label={itemData.user.userName}
            >
              {itemData.user.userName.charAt(0)}
            </Avatar>
          }
          title={
            <TitleTypography variant="body2" fontWeight="bold">
              {itemData.user.userName}
            </TitleTypography>
          }
        />
        <CardMedia
          component="img"
          image={itemData.userFeedImage}
          sx={{ width: 390, height: 500 }}
          alt={itemData.caption}
        />
      </MuiCard>

      {/*  */}
      {/*  */}
      {/*  */}
      {/* 이 놈이 문제임 */}
      {/* <ProductTagListItem itemData={itemData} /> */}
      {/* 이 놈 필요 없음 */}
      {/*  */}
      {/*  */}
      {/*  */}

      {itemData.product &&
        itemData.product.map((result, index) => {
          return (
            // <Link
            //   to={`/item/${result.productId}`}
            //   key={result.productId}
            //   className="card-link"
            // >
            <Card
              key={index}
              title={result.productName}
              // subTitle={result.productCategory}
              price={result.productPrice}
              mainImage={result.productImage}
              // count={result.options[0].productStock}
            />
            // </Link>
          );
        })}
      <BottomNav />
    </div>
  );
}
