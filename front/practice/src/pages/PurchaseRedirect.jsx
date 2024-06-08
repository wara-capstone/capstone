import { message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchRefreshToken } from "../utils/authUtil";
import { setLocalStorage } from "../utils/setLocalStorage";


const PurchaseRedirect = () => {
  // 현재 페이지의 URL에서 쿼리 파라미터 추출
  const urlParams = new URL(window.location.href).searchParams;


  // 로컬 스토리지에서 이메일과 토큰을 가져와 변수에 할당
  // const email = localStorage.getItem("email");
  // let token = localStorage.getItem("token");
  const [purchaseCompleted, setPurchaseCompleted] = useState(false); // 구매 완료 상태 관리

  // 각 쿼리 파라미터의 값을 변수에 할당
  const imp_uid = urlParams.get("imp_uid");
  const merchant_uid = urlParams.get("merchant_uid"); //
  const imp_success = urlParams.get("imp_success");
  const error_code = urlParams.get("error_code"); // 이 파라미터는 에러가 있을 때만 존재
  const error_msg = urlParams.get("error_msg"); // 이 파라미터는 에러가 있을 때만 존재
  let token = urlParams.get("token"); //
  let refreshToken = urlParams.get("refreshToken"); //
  let email = urlParams.get("email"); //
  let role = urlParams.get("role"); //
  let kakaoUserId = urlParams.get("kakaoUserId"); //

  // 추출한 값 확인을 위해 콘솔에 출력
  console.log(`imp_uid: ${imp_uid}`);
  console.log(`merchant_uid: ${merchant_uid}`);
  console.log(`imp_success: ${imp_success}`);
  console.log(`error_code: ${error_code}`);
  console.log(`error_msg: ${error_msg}`);

  const navigate = useNavigate();
  useEffect(() => {
    console.log("구매 완료 상태: ", purchaseCompleted);
  }, [purchaseCompleted]);

  useEffect(async () => {
    // message.success(`토큰 상태 확인:${sharedToken}`, 100);
    async function paymentVerification(tryVerificationAgain = true) {
      // 결제 검증하기
      try {
        await setLocalStorage(
          token,
          refreshToken,
          email,
          role,
          kakaoUserId
        )
        const paymentResponse = await fetch(
          `${process.env.REACT_APP_API_URL}payment/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({
              paymentUid: imp_uid, // 결제고유번호
              orderUid: merchant_uid, // 고객사 주문번호
            }),
          }
        );
        if (paymentResponse.status === 401 && tryVerificationAgain) {
          const RefreshToken = localStorage.getItem("RefreshToken");
          await fetchRefreshToken(RefreshToken);
          token = localStorage.getItem("token");
          return paymentVerification(false);
        } else if (paymentResponse.status === 201) {
          message.success(paymentResponse.message);

          // localStorage에서 checkList를 가져와서 배열로 파싱
          let storedCheckList = localStorage.getItem("checkList");
          let checkList = storedCheckList ? JSON.parse(storedCheckList) : [];

          if (checkList.length > 0) {
            let deleteString = "";
            checkList.forEach((id) => {
              deleteString += `&cart_item_id=${id}`;
            });

            console.log(deleteString);

            const fetchData = async () => {
              const response = await fetch(
                `${process.env.NODE_ENV === "development" ? "http://" : ""}${
                  process.env.REACT_APP_API_URL
                }cart/items/?user_email=` +
                  localStorage.getItem("email") +
                  deleteString,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                  },
                }
              );
              if (response.status === 204) {
                console.log("장바구니 삭제 성공");
                localStorage.removeItem("checkList");
                setPurchaseCompleted(true); // 구매 완료 상태 설정
              } else {
                console.log(response);
                console.log("장바구니 삭제 실패");
                console.log(response.status);
              }
            };
            fetchData();
          }

          setPurchaseCompleted(true); // 구매 완료 상태 설정
        } else {
          alert(
            "모바일 결제 검증 실패 " +
              paymentResponse.status +
              " " +
              paymentResponse
          );
        }
      } catch (error) {
        alert(`에러로 모바일 결제 실패: ${error.message}`);
      }
    }
    paymentVerification();
  }, []);

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "20rem",
      margin: 0,
    },
    spinner: {
      border: "4px solid rgba(0, 0, 0, 0.1)",
      borderLeft: "4px solid #3498db",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      animation: "spin 1s linear infinite",
    },
    message: {
      marginLeft: "10px",
      // fontSize: '16px',
      color: "#888" /* 연한 색으로 색상을 변경합니다. */,
    },
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
  };

  return (
    <div className="home">
      <Header forceRedirect={`/`} />
      <div style={styles.container}>
        <h1></h1>
        {purchaseCompleted ? (
          <h3 style={styles.message}>구매가 완료되었습니다.</h3>
        ) : (
          <>
            <div style={styles.spinner}></div>
            <h3 style={styles.message}>구매 중...</h3>
          </>
        )}
      </div>
    </div>
  );
};

export default PurchaseRedirect;
