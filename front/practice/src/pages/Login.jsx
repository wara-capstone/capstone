// Login.js

import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const handleLogin = () => {
    // 로그인 처리 로직을 구현합니다.
  };

  return (
    <div className="login-container">
      <h2>로그인 페이지</h2>
      <form className="login-form">
        <label htmlFor="username">이메일</label>
        <input type="text" id="username" />

        <label htmlFor="password">비밀번호</label>
        <input type="password" id="password" />

        <button onClick={handleLogin}>로그인</button>

        <p className="signup-link">
          아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
