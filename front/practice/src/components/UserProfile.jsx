import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import "./UserProfile.css";

const UserProfile = () => {
  const email = localStorage.getItem("email");
  const userRole = localStorage.getItem("role");
  const storeId = localStorage.getItem("storeid");
  const token = localStorage.getItem("token");
  const RefreshToken = localStorage.getItem("RefreshToken");

  let url;

  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);

  const [user, setUser] = useState({
    name: "유저",
    profileImage: "https://via.placeholder.com/150x150",
    email: email,
    nickname: userRole,
    phoneNumber: "010-1234-5678",
  });

  useEffect(() => {
    if (userRole === "user") {
      setIsSeller(false);
    } else if (userRole === "seller") {
      setIsSeller(true);
    }
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(
        `${process.env.NODE_ENV === "development" ? "http://" : ""}${
          process.env.REACT_APP_API_URL
        }user?email=` + email,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 401) {
        const fetchToken = async () => {
          const response = await fetch(
            `${process.env.NODE_ENV === 'development' ? 'http://' : ''}${process.env.REACT_APP_API_URL}auth/signin`,
            {
              method: "GET",
              headers: {
                Authorization: `${RefreshToken}`
              },
            }
          );
          console.log("AccessToken 재발급 요청중!!!!!!!!!!!!");
          if (response.status === 201) {
            const result = await response.json();

            localStorage.setItem("token", result.accessToken);  // 여기서 AccessToken을 저장합니다.
            localStorage.setItem("RefreshToken", result.refreshToken); // 여기서 RefreshToken을 저장.
  
            console.log("리프레시 토큰, 엑세스 토큰 재발급 완료!!!!!!!!!!!!");
  
          } else {
            console.log("실패");
            navigate("/login");
          }
        };
        fetchToken();

      } else if (response.status === 200) {
        const result = await response.json();
        setUser({
          ...user, // 기존 user 객체를 복사합니다.
          name: result.nickname,
          email: result.email, // email 속성만 변경합니다.
          profileImage: result.profileImage, // profileImage 속성만 변경합니다.
          phoneNumber: result.phone,
        });
        console.log("받아온 사진 존재,", result.profileImage);

        // localStorage.removeItem("token");
        // localStorage.removeItem("email");
        // localStorage.removeItem("role");
        // localStorage.removeItem("storeid");
        // setLoading(false);
        // navigate("/");
      } else {
        console.log("실패");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그아웃 처리 로직을 구현합니다.
    message.success("로그아웃 되었습니다.");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("storeid");
    // 페이지 이동
    navigate("/");
  };

  const handleConnectSeller = () => {
    // seller사이트 접속 처리 로직을 구현합니다.

    // 페이지 이동
    navigate("/seller");
  };

  if (loading) {
    return <LoadingScreen></LoadingScreen>;
  } else {
    return (
      <div className="user-profile">
        <div className="profile-section">
          <div className="profile-image">
            <img src={user.profileImage} alt="프로필 사진" />
          </div>
          <div className="user-info">
            <h2>{user.name}</h2>
            <p>{user.nickname}</p>
            <p>{user.email}</p>
            <p>{user.phoneNumber}</p>
          </div>
        </div>

        <div className="profile-btn-container">
          <Link to="/user/edit" className="user-link">
            <button className="edit-profile-btn">
              <span role="img" aria-label="pencil">
                ✏️
              </span>{" "}
              나의 회원정보 수정
              <div className="move-page-icon">
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </button>
          </Link>

          <Link to="/user/chattingList" className="user-link">
            <button className="chattingList-btn">
              <span role="img" aria-label="conversation">
                💬
              </span>{" "}
              나의 1대1 상담 내역
              <div className="move-page-icon">
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </button>
          </Link>
          {!isSeller && (
            <Link to="/user/purchaseHistory" className="user-link">
              <button className="chattingList-btn">
                <span role="img" aria-label="conversation">
                  📝
                </span>{" "}
                나의 구매 내역
                <div className="move-page-icon">
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
              </button>
            </Link>
          )}
        </div>

        <div className="move-seller-page-btn-container">
          {isSeller && (
            <button
              className="move-seller-page-btn"
              onClick={handleConnectSeller}
            >
              사장님 페이지
              <div className="move-page-icon">
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </button>
          )}
        </div>

        <div className="user-logout-btn-container">
          <button className="user-logout-btn" onClick={handleLogout}>
            로그아웃
            <div className="move-page-icon">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </button>
        </div>
      </div>
    );
  }
};
export default UserProfile;
