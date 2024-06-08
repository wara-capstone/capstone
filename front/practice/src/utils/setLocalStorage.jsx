// src/utils/authUtils.js



export const setLocalStorage = async (accessToken, refreshToken, email, role, kakaoUserId) => {
    localStorage.setItem("token", accessToken);  // 여기서 Access 토큰을 저장합니다.
    localStorage.setItem("RefreshToken", refreshToken); // 여기서 RefreshToken을 저장.
    localStorage.setItem("email", email); // 여기서 userid를 저장합니다.
    localStorage.setItem("role", role); // 여기서 role를 저장합니다.
    localStorage.setItem("kakaoUserId", kakaoUserId); // 여기서 kakaoUserId를 저장합니다.
    }