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
  let token = localStorage.getItem("token");
  let RefreshToken = localStorage.getItem("RefreshToken");
  const [role, setRole] = useState("user");

  let url;

  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);

  const [user, setUser] = useState({
    name: "유저",
    profileImage: "https://via.placeholder.com/150x150",
    email: email,
    role: role,
    phoneNumber: "010-1234-5678",
  });

  useEffect(() => {
    if (userRole === "user") {
      setIsSeller(false);
      setRole("고객");
    } else if (userRole === "seller") {
      setIsSeller(true);
      setRole("판매자");
    }
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(
        `${process.env.NODE_ENV === "development" ? "" : ""}${
          process.env.REACT_APP_API_URL
        }user?email=` + email,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response.status === 401) {
        const fetchToken = async () => {
          const response = await fetch(
            `${process.env.NODE_ENV === "development" ? "" : ""}${process.env.REACT_APP_API_URL}auth/signin`,
            {
              method: "GET",
              headers: {
              Authorization: localStorage.getItem("RefreshToken"),
              },
            }
          );
          console.log("AccessToken 재발급 요청중!!!!!!!!!!!!");
          if (response.status === 201) {
            const result = await response.json();

            localStorage.setItem("RefreshToken", result.refreshToken); // 여기서 RefreshToken을 저장.
            console.log("리프레시 토큰 재발급 완료!");
            localStorage.setItem("token", result.accessToken); // 여기서 AccessToken을 저장합니다.
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
  }, [token]);

  const navigate = useNavigate();

  const handleLogout = () => {
    const KakaoLogout = async () => {
      const response = await fetch(
        `https://kapi.kakao.com/v1/user/logout?target_id_type=user_id&target_id=${localStorage.getItem(
          "kakaoUserId"
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `KakaoAK b2077c53d402d3e5755993907e3cc0e9`,
          },
          body: JSON.stringify({
            target_id_type: "user_id",
            target_id: localStorage.getItem("kakaoUserId"),
          }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        console.log("로그아웃한 아이디" + result.id);
      } else {
        console.log("실패");
        console.log(response.status);
      }
    };
    KakaoLogout();

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
            <p>{role}</p>
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

          {!isSeller && (
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
          )}

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
          {/* <Link to="/user/pageUpload" className="user-link">
            <button className="chattingList-btn">
              <span role="img" aria-label="upload">
                📤
              </span>{" "}
              글 업로드
              <div className="move-page-icon">
                <FontAwesomeIcon icon={faChevronRight} />
                
              </div>
            </button>
          </Link> */}
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
