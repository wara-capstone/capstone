// Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import{
  message
} from "antd";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCheck, setLoginCheck] = useState(false); // 로그인 상태 체크

  const navigate = useNavigate();

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
      localStorage.setItem("storeid", result.storeId); // 여기서 role를 저장합니다.
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
        <button onClick={handleLogin}>로그인</button>

        <p className="signup-link">
          아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
