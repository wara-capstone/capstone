// Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import{
  message
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// 아래 줄에서 faEnvelope 아이콘을 import합니다.
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import KakaoButtonImage from "../adImages/kakao_login.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCheck, setLoginCheck] = useState(false); // 로그인 상태 체크

  const redirect_uri = `https://www.onoff.zone/loading`;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=5d3f977e28b7baf6825e7f34c62fd79a&redirect_uri=${redirect_uri}&response_type=code&prompt=select_account`;

  const navigate = useNavigate();

  const handleKakaoLogin = async (event) => {
    // 로그인 처리 로직을 구현합니다.
    event.preventDefault();

    window.location.href = kakaoURL;
  };

  const handleLogin = async (event) => {
    // 로그인 처리 로직을 구현합니다.
    event.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    
    const response = await fetch(
      `${process.env.NODE_ENV === 'development' ? 'http://' : ''}${process.env.REACT_APP_API_URL}auth/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );
    const result = await response.json();

    if (response.status === 200) {
      setLoginCheck(false);
      // Store token in local storage
      console.log("로그인 전"+ localStorage.getItem("email"), localStorage.getItem("role"), localStorage.getItem("storeid"), localStorage.getItem("token"));
      localStorage.setItem("token", result.accessToken);  // 여기서 Access 토큰을 저장합니다.
      localStorage.setItem("RefreshToken", result.refreshToken); // 여기서 RefreshToken을 저장.

      localStorage.setItem("email", result.email); // 여기서 userid를 저장합니다.
      localStorage.setItem("role", result.role); // 여기서 role를 저장합니다.
      localStorage.setItem("storeid", result.storeId); // 여기서 storeId를 저장합니다.
      localStorage.setItem("kakaoUserId", result.kakaoUserId); // 여기서 kakaoUserId를 저장합니다.

      console.log("로그인성공, 이메일주소:" + result.email);
      console.log("로그인 후"+ localStorage.getItem("email"), localStorage.getItem("role"), localStorage.getItem("storeid"), localStorage.getItem("token"));
      message.success("로그인되었습니다.", 2);
      navigate("/"); // 로그인 성공시 홈으로 이동합니다.
    } else {
      setLoginCheck(true);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>On&Off</h1>
        <label htmlFor="username">이메일</label>
        <input
          type="text"
          id="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
         {loginCheck && (
        <label  style={{color: "red"}}>이메일 혹은 비밀번호가 틀렸습니다.</label>
        )}
        <button onClick={handleLogin}>
        <FontAwesomeIcon icon={faEnvelope} size="lg" style={{  marginLeft: '0.3rem'}} />
      {/* 텍스트를 span 태그로 감싸고 스타일을 적용합니다. */}
      <span style={{ flex: 1, textAlign: 'center' }}>로그인</span>
      </button>
        <img src={KakaoButtonImage}
      style={{
        cursor: "pointer",
        height: "2.7rem",
        width: "18.7rem",
        marginTop: "0.3rem",
      }}
      onClick={handleKakaoLogin}></img>
        <p className="signup-link">
          아직 회원이 아니신가요? <Link to="/signup-choice">회원가입</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
