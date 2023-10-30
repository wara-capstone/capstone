import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "ON&OFF",
    profileImage: "https://via.placeholder.com/150x150",
    email: "ON&OFF@example.com",
    nickname: "ONFF",
    phoneNumber: "010-1234-5678",
  });

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
    </div>
  );
};

export default UserProfile;
