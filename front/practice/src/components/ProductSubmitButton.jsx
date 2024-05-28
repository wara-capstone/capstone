import React from 'react';
import { Button } from '@mui/material';
import { Email } from '@mui/icons-material';

const ProductSubmitButton = ({ userEmail, productData }) => {
  const handleSubmit = async () => {
    // Create FormData object
    const formData = new FormData();
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");

    formData.append('user[userEmail]', userEmail);

    productData.forEach((product, index) => {
      formData.append(`product[${index}][productImage]`, product.productImage);
      formData.append(`product[${index}][productName]`, product.productName);
      formData.append(`product[${index}][productPrice]`, product.productPrice);
    });

        // Create payload
        const payload = {
            "user": {
              "userEmail": Email
            },
            "product": [
              {
                "productImage": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fm.ssg.com%2Fitem%2FitemView.ssg%3FitemId%3D1000442179709&psig=AOvVaw2klTQBVp69Ae25FZa6NQ-x&ust=1716269576867000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPDGj8XAm4YDFQAAAAAdAAAAABAE",
                "productName": "Product 2",
                "productPrice": "7777"
              }
            ]
          }
    try {
        const response = await fetch(
        `http://101.101.216.115:8080/api/user-feed`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${token}`
            },
            body: formData,
          }
        );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
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
