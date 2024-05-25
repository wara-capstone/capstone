// src/utils/authUtils.js

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
  
      localStorage.setItem("token", result.accessToken);  // 여기서 AccessToken을 저장합니다.
      localStorage.setItem("RefreshToken", result.refreshToken); // 여기서 RefreshToken을 저장.
  
      console.log("리프레시 토큰, 엑세스 토큰 재발급 완료!!!!!!!!!!!!");
  
    } else {
      console.log("리프레시 토큰 발급 실패");
    }
  };
  