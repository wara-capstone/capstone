import { Link, useNavigate } from "react-router-dom";
import Data from "../DB/Data.json";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card"; // Card 컴포넌트 임포트
import EventButton from "../components/EventButton";
import Header from "../components/Header";
import { useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import PurchaseProduct from "../components/PurchaseProduct";
import "../components/CartComponents.css";
import{
  message
} from "antd";
import { fetchRefreshToken } from "../utils/authUtil";


export default function Purchase() {
  const { IMP } = window; // 아임포트 모듈
  const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

  const location = useLocation();
    const { checkList, selectedItems } = location.state;

    // 총 금액
  const totalPrice = selectedItems.reduce((acc, item) => acc + (item.product.price), 0);


  useEffect(() => { // ProductId, pColor, pSize로 optionId 가져오기
    selectedItems.forEach(item => {
      console.log("item", item);
      const productId = item.product.p_id;
      const pColor = item.product.color;
      const pSize = item.product.size;

      const fetchData = async () => {
        console.log("값들", productId, pColor, pSize);
        const response = await fetch(
          `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}product/all/product/${productId}/${pColor}/${pSize}`,
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
          fetchRefreshToken(RefreshToken);
          token = localStorage.getItem("token");
        }
  
        if (response.status === 200) {
          const result = await response.json();
          console.log("성공");
          // console.log("받아온 옵션 값",result);
          item.product.optionId = result.optionId;
          item.product.stock = result.productStock;
        } else {
          console.log("실패");
        }
      };
      fetchData();
    });
  }, [token]);


async function clickPurchase(tryAgain = true) { // 구매하기 버튼 클릭시 실행되는 함수

    // selectedItems.forEach(item => {
    //   if(item.product.stock < item.product.quantity){
    //     message.error(`${item.product.p_name}의 재고가 부족합니다.`);
    //     return;
    //   }
    // });
  
    const insufficientItems = selectedItems.filter(item => item.product.stock < item.product.quantity);
    if (insufficientItems.length > 0) {
        insufficientItems.forEach(item => {
            message.error(`${item.product.p_name}의 재고가 부족합니다.`);
        });
        return;
    }
  
  
  const fetchPurchase = async (tryPurchaseAgain = true) => {
  
    const totoalPayment = {
      purchaser: email,
      totalPrice: totalPrice
      }
  
    const payment = selectedItems.map(item => {
        return {
          storeId: item.store_id,
          productId: item.product.p_id,
          optionId: item.product.optionId,
          price: item.product.price / item.product.quantity,
          quantity: item.product.quantity,
        };
      });
  
  
    var formData;
      formData = new FormData();
      formData.append('order', new Blob([JSON.stringify(totoalPayment)], { type: "application/json" }));
      formData.append('orderItem', new Blob([JSON.stringify(payment)], { type: "application/json" }));
  
    const PurchaseInformation = await fetch(  // 모의결제에 필요한 정보 가져오고 주문내역 보내기
    `${process.env.REACT_APP_API_URL}order/create`,
    {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        "Authorization": `${token}`
      },
      body : formData,
      // body: JSON.stringify({
      //   // 나중에 수정될 주문 정보 데이터
      // }),
    }
  );
  
  if (PurchaseInformation.status === 401 && tryPurchaseAgain) {
    const RefreshToken = localStorage.getItem("RefreshToken");
    await fetchRefreshToken(RefreshToken);
    token = localStorage.getItem("token");
    return fetchPurchase(false);
  }
  
  if (PurchaseInformation.status === 200) {
    
    // 장바구니 삭제를 위한 cart_item_id 배열을 localStorage에 저장
    if (checkList !== undefined) {
      localStorage.setItem('checkList', JSON.stringify(checkList));
    }
  
    const result = await PurchaseInformation.json();  // 값
    console.log("성공");
  
    // 포트원 모의결제 시작
    IMP.init(`imp77151582`); // 아임포트 모듈 초기화
  
    // 백엔드로부터 주문 정보를 가져온 후 data에 넣기
    const data = {
      pg: `html5_inicis.INIpayTest`, // PG사
      pay_method: "card", // 결제수단
      merchant_uid: result.orderId, // 주문번호
      amount: totalPrice, // 결제금액
      name: "ON&OFF 결제", // 주문명
      // buyer_name: "이름1", // 구매자 이름
      // buyer_tel: "010-1234-1234", // 구매자 전화번호
      buyer_email: email, // 구매자 이메일
      // buyer_addr: "대구광역시", // 구매자 주소
      // buyer_postcode: 40000, // 구매자 우편번호
      m_redirect_url: "", // 결제 완료 후 이동할 주소
  };

  const callback = (response) => {
    const { success, error_msg } = response;
  
      async function paymentVerification(tryVerificationAgain = true) {  // 결제 검증하기
      try {
        const paymentResponse = await fetch(`${process.env.REACT_APP_API_URL}payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  token,
        },
        body: JSON.stringify({
          paymentUid: response.imp_uid,  // 결제고유번호
          orderUid: response.merchant_uid, // 고객사 주문번호
        }),
      })
          if (paymentResponse.status === 401 && tryVerificationAgain) {
            const RefreshToken = localStorage.getItem("RefreshToken");
            await fetchRefreshToken(RefreshToken);
            token = localStorage.getItem("token");
            return paymentVerification(false);
  
          } else if (paymentResponse.status === 201) {

            // 검증 요청에 대한 응답 JSON 파싱
            // const paymentResult = await paymentResponse.json();

            console.log("결제 검증 성공");

            message.success("구매가 완료되었습니다.", 2);

            if (checkList !== undefined) {
            // 구매후 장바구니 삭제
            var deleteString ='';
            checkList.forEach(id => {
              deleteString += `&cart_item_id=${id}`;
            });
        
            console.log(deleteString);
              const fetchData = async () => {
               const response = await fetch(
                 `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}cart/items/?user_email=`+email+deleteString,
                 {
                   method: "DELETE",
                   headers: {
                     "Content-Type": "application/json",
                     "Authorization": `${token}`
                   },
                 }
               );
               if (response.status === 204) {
                 console.log("성공");
                 localStorage.removeItem('checkList');
               }
                else {
                console.log(response);
                 console.log("실패");
                 console.log(response.status);
               }
             };
             fetchData();
            }
             navigate("/");

          }
          else {
            alert("결제 검증 실패");
          }
    } catch (error){
      alert(`결제 실패: ${error_msg}`);
    }
  }
    paymentVerification();

    };
  
    IMP.request_pay(data, callback);
  
  
  } else {
    console.log("실패");
  }
  };
  fetchPurchase();
  // 구매 버튼 클릭시 정보 가져오고 결제창 띄우기 끝
}

// async function clickPurchase(tryAgain = true) {
//     // Create payload

//   // selectedItems.forEach(item => {
//   //   if(item.product.stock < item.product.quantity){
//   //     message.error(`${item.product.p_name}의 재고가 부족합니다.`);
//   //     return;
//   //   }
//   // });

//   const insufficientItems = selectedItems.filter(item => item.product.stock < item.product.quantity);
//   if (insufficientItems.length > 0) {
//       insufficientItems.forEach(item => {
//           message.error(`${item.product.p_name}의 재고가 부족합니다.`);
//       });
//       return;
//   }


//     const totoalPayment = {
//       purchaser: email,
//       totalPrice: totalPrice
//       }

//       const payment = selectedItems.map(item => {
//         return {
//           storeId: item.store_id,
//           productId: item.product.p_id,
//           optionId: item.product.optionId,
//           price: item.product.price / item.product.quantity,
//           quantity: item.product.quantity,
//         };
//       });


//     var formData;
//       formData = new FormData();
//       formData.append('totalPayment', new Blob([JSON.stringify(totoalPayment)], { type: "application/json" }));
//       formData.append('payment', new Blob([JSON.stringify(payment)], { type: "application/json" }));

//     try {
//       const response = await fetch(
//         `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}payment/create`,
//         {
//           method: "POST",
//           headers: {
//             "Authorization": `${token}`
//           },
//           body: formData
//         }
//       );
//       console.log(response);

//       if (response.status === 401 && tryAgain) {
//         const RefreshToken = localStorage.getItem("RefreshToken");
//         fetchRefreshToken(RefreshToken);
//         token = localStorage.getItem("token");
//         return clickPurchase(false);
//       }


//       if (response.status === 201) {
        
//         message.success("구매가 완료되었습니다.", 2);

//         if (checkList !== undefined) {
//         // 구매후 장바구니 삭제
//         var deleteString ='';
//         checkList.forEach(id => {
//           deleteString += `&cart_item_id=${id}`;
//         });
    
//         console.log(deleteString);
//           const fetchData = async () => {
//            const response = await fetch(
//              `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}cart/items/?user_email=`+email+deleteString,
//              {
//                method: "DELETE",
//                headers: {
//                  "Content-Type": "application/json",
//                  "Authorization": `${token}`
//                },
//              }
//            );
//            if (response.status === 204) {
//              console.log("성공");
//            }
//             else {
//             console.log(response);
//              console.log("실패");
//              console.log(response.status);
//            }
//          };
//          fetchData();
//         }

//          navigate("/");

//       } else if (response.status !== 201) {
//           const errorData = await response.json();
//           console.log(errorData);
//       }
//       else if (response.status === 400) {
//         // Handle error
//         message.error("잘못된 요청입니다.");
//       }
//     } catch (error) {
//       console.error("오류 발생:", error);
//       message.error("잘못된 요청입니다.");
//     }
// }


  return (
    <div className="cart-page">
      <Header />
      <div>
        {selectedItems.length && ( 
            <div className="Cart">
    {selectedItems.map(selectedBread =>(
        <PurchaseProduct
            selectedBread={selectedBread}
            key={selectedBread.cart_item_id}
            // changeSingleBox={changeSingleBox}
            data={selectedBread}
            // checkList={checkList}
        />
        ))}
        </div>
        )}
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
        <div>
          <label>구매 상품 개수: </label>
          <span>{selectedItems.length}</span>
        </div>
        <div>
          <label>결제 총 금액: </label>
          <span>{totalPrice.toLocaleString()}원</span> 
        </div>
      </div>
<div style={{bottom: "1rem", position: "fixed", justifyContent:"center", transform: "translate(-50%, -50%)", left:"50%"}}>
      <EventButton buttonText={"결제"} onClick={clickPurchase} />
</div>
      <BottomNav />
    </div>
  );
}
