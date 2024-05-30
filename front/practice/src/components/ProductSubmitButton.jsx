import { Button } from "@mui/material";
import React from "react";

const ProductSubmitButton = ({ productData, imageFile }) => {
  const url = `${process.env.NODE_ENV === "development" ? "" : ""}${
    process.env.REACT_APP_API_URL
  }user-feed`;

  const handleSubmit = async () => {
    // Create FormData object

    let token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");
    console.log("버튼 눌렀을 때 상품표시");
    console.log(productData);
    console.log("이미지파일이 뜨는부분");
    console.log(imageFile);

    // const product = [
    //   {
    //     productImage: "https://static.smalljoys.me/2018/05/1-180.jpg",
    //     productName: "Product 2",
    //     productPrice: "7777"
    //   }
    // ];
    try {
      const user = {
        userEmail: userEmail,
      };

      const product = [];
      for (let i = 0; i < productData.length; i++) {
        product.push({
          productImage: productData[i].productUrls[0].url,
          productName: productData[i].productName,
          productPrice: productData[i].price,
        });
      }

      const userFeed = {
        user: user,
        product: product,
      };

      const formData = new FormData();
      formData.append("image", imageFile); // 이미지 파일 추가
      formData.append(
        "userFeed",
        new Blob([JSON.stringify(userFeed)], { type: "application/json" })
      ); // JSON 데이터 추가

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          //  "Content-Type": "application/json" // JSON 데이터 형식 지정
        },
        body: formData,
      });

      if (response.ok) {
        console.log("상품 정보가 성공적으로 전송되었습니다.");
      } else {
        console.error("상품 정보 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      style={{
        border: "1px solid #ccc",
        position: "relative",
        top: 10,
        left: 100,
      }}
      onClick={handleSubmit}
    >
      등록
    </Button>
  );
};

export default ProductSubmitButton;
