import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "ON&OFF",
    profileImage: "https://via.placeholder.com/150x150",
    email: "ON&OFF@example.com",
    nickname: "ONFF",
    phoneNumber: "010-1234-5678",
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그아웃 처리 로직을 구현합니다.

    // 페이지 이동
    navigate("/");
  };

  const handleConnectSeller = () => {
    // 로그아웃 처리 로직을 구현합니다.

    // 페이지 이동
    navigate("/seller");
  };

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
      </div>

      <Link to="/login" className="user-link">
        <button className="login-btn">로그인</button>
      </Link>

      <button className="move-seller-page-btn" onClick={handleConnectSeller}>
        사장님 페이지 연결
        <div className="move-page-icon">
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </button>

      <button className="user-logout-btn" onClick={handleLogout}>
        로그아웃
        <div className="move-page-icon">
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </button>
    </div>
  );
};

export default UserProfile;
