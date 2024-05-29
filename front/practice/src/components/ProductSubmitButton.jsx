import React from 'react';
import { Button } from '@mui/material';
import { Email } from '@mui/icons-material';
import PageUpload from '../pages/PageUpload';


const ProductSubmitButton = ({ productData, imageFile }) => {
  
  const handleSubmit = async () => {
    // Create FormData object
  

    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");
    console.log("버튼 눌렀을 때 상품표시");
    console.log(productData);
    console.log("이미지파일이 뜨는부분");
    console.log(imageFile);

    //formData.append('user[userEmail]', userEmail);

    // productData.forEach((product, index) => {
    //   formData.append(`product[${index}][productImage]`, product.productImage);
    //   formData.append(`product[${index}][productName]`, product.productName);
    //   formData.append(`product[${index}][productPrice]`, product.productPrice);
    // });

        // // Create payload
        // const payload = {
        //     "user": {
        //       "userEmail": Email
        //     },
        //     "product": [
        //       {
        //         "productImage": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fm.ssg.com%2Fitem%2FitemView.ssg%3FitemId%3D1000442179709&psig=AOvVaw2klTQBVp69Ae25FZa6NQ-x&ust=1716269576867000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPDGj8XAm4YDFQAAAAAdAAAAABAE",
        //         "productName": "Product 2",
        //         "productPrice": "7777"
        //       }
        //     ]
        //   }
   
        try {
          const data = {
            user: {
              userEmail: userEmail
            },
            product: [
              {
                productImage: "https://static.smalljoys.me/2018/05/1-180.jpg",
                productName: "Product 2",
                productPrice: "7777"
              }
            ]
          };

          const user = {
  userEmail: "qqqq@naver.com"
};

const product = [
  {
    productImage: "https://static.smalljoys.me/2018/05/1-180.jpg",
    productName: "Product 2",
    productPrice: "7777"
  }
];

const formData = new FormData();
formData.append('image', imageFile); // 이미지 파일 추가
formData.append('userFeed', new Blob([JSON.stringify({ user, product })], { type: "application/json" })); // JSON 데이터 추가

const response = await fetch(
  `http://101.101.216.115:21000/api/user-feed`,
  {
    method: "POST",
    headers: {
      "Authorization": `${token}`
    },
    body: formData
  }
);
        
          if (response.ok) {
            console.log('상품 정보가 성공적으로 전송되었습니다.');
          } else {
            console.error('상품 정보 전송에 실패했습니다.');
          }
        } catch (error) {
          console.error(error);
        }
  };

  return (
    <Button
      style={{
        border: '1px solid #ccc',
        position: 'relative',
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
