// Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import{
  message
} from "antd";
import KakaoButtonImage from "../adImages/kakao_login_large_wide.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// 아래 줄에서 faEnvelope 아이콘을 import합니다.
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';


const SignupChoice = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCheck, setLoginCheck] = useState(false); // 로그인 상태 체크

  // const redirect_uri = `https://www.onoff.zone/signup`;
  const redirect_uri = `${process.env.NODE_ENV === 'development' ? 'http://' : ''}${process.env.REACT_APP_REDIRECT_URL}signup`
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=5d3f977e28b7baf6825e7f34c62fd79a&redirect_uri=${redirect_uri}&response_type=code&prompt=login`;

  const navigate = useNavigate();

  // const handleSignup = async (event) => {
  //   // 로그인 처리 로직을 구현합니다.
  //   event.preventDefault();
  //   await new Promise((r) => setTimeout(r, 1000));
    
  //   const response = await fetch(
  //     `${process.env.NODE_ENV === 'development' ? 'http://' : ''}${process.env.REACT_APP_API_URL}auth/signin`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: email,
  //         password: password,
  //       }),
  //     }
  //   );
  //   const result = await response.json();

  //   if (response.status === 200) {
  //       message.success("로그인되었습니다.", 2);
  //     navigate("/"); // 로그인 성공시 홈으로 이동합니다.
  //   } else {
  //     setLoginCheck(true);
  //   }
  // };

  const handleSignup = async (event) => {
    // 로그인 처리 로직을 구현합니다.
    event.preventDefault();
    navigate("/signup");
  };

  const handleKakaoSignup = async (event) => {
    // 로그인 처리 로직을 구현합니다.
    event.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    console.log(kakaoURL + "kakaoURL")
    window.location.href = kakaoURL;

  };

  return (
    <div className="signup-container" style={{
      gap: "0.5rem", // 아이템 간의 간격을 0.5rem으로 설정
    }}>
      <button className="signup-choice" onClick={handleSignup}>
      <FontAwesomeIcon icon={faEnvelope} size="lg" style={{  marginLeft: '0.6rem'}} />
      {/* 텍스트를 span 태그로 감싸고 스타일을 적용합니다. */}
      <span style={{ flex: 1, textAlign: 'center' }}>이메일로 회원가입</span>
      </button>
      <img src={KakaoButtonImage}
      style={{
        cursor: "pointer",
        height: "4rem",
        width: "25rem",
      }}
      onClick={handleKakaoSignup}></img>

    </div>
  );
};

export default SignupChoice;
