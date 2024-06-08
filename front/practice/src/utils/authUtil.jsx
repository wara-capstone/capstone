// src/utils/authUtils.js
import { message } from "antd";


export const fetchRefreshToken = async (RefreshToken) => {

    console.log("AccessToken 재발급 요청중!!!!!!!!!!!!");
    const response = await fetch(
      `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}auth/signin`,
      {
        method: "GET",
        headers: {
          Authorization: `${RefreshToken}`
        },
      }
    );
  
    if (response.status === 201) {
      const result = await response.json();
  
      sessionStorage.setItem("token", result.accessToken);  // 여기서 AccessToken을 저장합니다.
      sessionStorage.setItem("RefreshToken", result.refreshToken); // 여기서 RefreshToken을 저장.
  
      console.log("리프레시 토큰, 엑세스 토큰 재발급 완료!!!!!!!!!!!!");
  
    } else {
      console.log("리프레시 토큰 발급 실패");
      // 로그아웃 처리 로직을 구현합니다.
      message.success("로그아웃 되었습니다.");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("storeid");
      sessionStorage.removeItem("RefreshToken");

      // 페이지 이동
      window.location.href = "/login";
      return;
    }
  };
  