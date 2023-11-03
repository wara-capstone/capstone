import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import BottomNav from "../components/BottomNav";
import EventButton from "../components/EventButton";
import Header from "../components/Header";

const UserEdit = ({ user }) => {
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.name || "");
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [image, setImage] = useState();
  const [previewImageSrc, setPreviewImageSrc] = useState(
    user?.profileImage || "https://via.placeholder.com/150x150"
  );

  // form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement the code to send updated data to the server
    console.log({ email, name, nickname, phoneNumber, password, image });
  };

  // image change handler
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreviewImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-edit">
      <Header />
      <div className="userEdit-image">
        <img src={previewImageSrc} alt="프로필 사진" />
        <label className="edit-icon">
          <FontAwesomeIcon icon={faPen} />
          <input
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="userEdit-info-container">
        <label>이메일</label>
        <div className="userEdit-email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label>이름</label>
        <div className="userEdit-name">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <label>닉네임</label>
        <div className="userEdit-nickname">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <label>전화번호</label>
        <div className="userEdit-phone">
          <input
            type="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <label>비밀번호</label>
        <div className="userEdit-password">
          <input
            type="password"
            value={password}
            placeholder="새로운 비밀번호 입력"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <label>비밀번호 확인</label>
        <div className="userEdit-password-confirm">
          <input
            type="password"
            value={passwordConfirm}
            placeholder="비밀번호 확인"
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
      </div>

      {/* submit button */}
      <EventButton type="submit" buttonText={"저장하기"} />
      <BottomNav />
    </form>
  );
};

export default UserEdit;
