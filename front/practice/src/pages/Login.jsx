// Login.js
import React,{ useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  const handleLogin =  async (event) => {
    // 로그인 처리 로직을 구현합니다.
    event.preventDefault();

    const response = await fetch('https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    const result = await response.json();

    if (response.status === 200) {
        // Store token in local storage
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('email', result.email);  // 여기서 userid를 저장합니다.
        sessionStorage.setItem('role', result.role);    // 여기서 role를 저장합니다.
        sessionStorage.setItem('storeid', result.storeId);    // 여기서 role를 저장합니다.
        console.log("로그인성공, 이메일주소:" + result.email);
    } else {
        alert("로그인에 실패하였습니다"); // token contains the error message in this case
    }
  };

  return (
    <div className="login-container">
      <h2>로그인 페이지</h2>
      <form className="login-form" onSubmit={handleLogin}>
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

        <button onClick={handleLogin}>로그인</button>

        <p className="signup-link">
          아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
