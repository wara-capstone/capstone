import React from "react";
import {useEffect, useState} from 'react';
import { Grid } from '@mui/material';
import ProductTagListItem from './ProductTagListItem';
import { fetchRefreshToken } from "../utils/authUtil";
import { message } from 'antd';

function ProductTagList({ posts, onProductSelect}){
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    console.log("구매 정보가 업데이트되었습니다.");
    console.log(purchaseItems);
  }, [purchaseItems]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}payment/read/user/${userEmail}`,
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
            `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}payment/read/user/${userEmail}`,
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
              `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}product/all/${productId}/option/${optionId}`,
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

    return(
        <Grid container spacing={2}> {/* 컨테이너 설정, 카드 사이의 간격은 2로 설정 */}
            {purchaseItems.map((post) => (
                <Grid item xs={12} sm={6} key={post.id}> {/* 반응형으로 설정: 작은 화면에서는 한 줄에 하나, 중간 크기 화면에서는 한 줄에 두 개 */}
                    <ProductTagListItem 
                        // id={post.id}
                        // userName={post.userName}
                        // userImg={post.productUrls[0].url}
                        // img={post.img}
                        // caption={post.caption}
                        // {...post} // 모든 post 프로퍼티를 ProductTagListItem에 전달
          
                        itemData={post}
                        onClick={() => onProductSelect(post)} // 클릭 이벤트 핸들러를 ProductTagListItem에 전달
                    />
                </Grid>
            ))}
        </Grid>

    );


}


export default ProductTagList;