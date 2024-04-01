import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoadingPage = () => {
    const code = new URL(window.location.href).searchParams.get("code");

    const navigate = useNavigate();

    useEffect(() => {
      const fetchData = async () => {
        try {
        const response = await fetch(
            `${process.env.NODE_ENV === 'development' ? 'http://' : ''}${process.env.REACT_APP_API_URL}auth/kakao/signin`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                code: code,
              }),
            }
          );
          const result = await response.json();
      
          if (response.ok) {
            // Store token in local storage
            console.log("로그인 전"+ localStorage.getItem("email"), localStorage.getItem("role"), localStorage.getItem("storeid"), localStorage.getItem("token"));
            localStorage.setItem("token", result.accessToken);  // 여기서 Access 토큰을 저장합니다.
            localStorage.setItem("RefreshToken", result.refreshToken); // 여기서 RefreshToken을 저장.
      
            localStorage.setItem("email", result.email); // 여기서 userid를 저장합니다.
            localStorage.setItem("role", result.role); // 여기서 role를 저장합니다.
            localStorage.setItem("storeid", result.storeId); // 여기서 storeid를 저장합니다.
            localStorage.setItem("kakaoUserId", result.kakaoUserId); // 여기서 kakaoUserId를 저장합니다.

            console.log("로그인성공, 이메일주소:" + result.email);
            console.log("로그인 후"+ localStorage.getItem("email"), localStorage.getItem("role"), localStorage.getItem("storeid"), localStorage.getItem("token"));
            navigate("/"); // 로그인 성공시 홈으로 이동합니다.
          } else {
            console.log("로그인실패");
            navigate("/login"); // 로그인 실패시 로그인 페이지로 이동합니다.
          }
        } catch (error) {
          console.error("로그인 중 에러 발생:", error);
          navigate("/login"); // 에러 발생시 로그인 페이지로 이동
        }
      };
      fetchData();
    }, []);

    const styles = {
        container: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '20rem',
          margin: 0,
        },
        spinner: {
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderLeft: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
        },
        message: {
          marginLeft: '10px',
          fontSize: '16px',
        },
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      };

    return (
      <div style={styles.container}>
        <h1></h1>
        <div style={styles.spinner}></div>
        <p style={styles.message}>로딩 중...</p>
      </div>
    );
  };

  export default LoadingPage;


