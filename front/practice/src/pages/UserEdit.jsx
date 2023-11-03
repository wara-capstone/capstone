import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import EventButton from "../components/EventButton";
import Header from "../components/Header";

const UserEdit = ({ user }) => {
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");

  const [nickname, setNickname] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  var [image, setImage] = useState("");
  const [previewImageSrc, setPreviewImageSrc] = useState("https://via.placeholder.com/150x150");

  useEffect( () => {
    console.log(token);
    console.log("위에꺼 토큰");
    const fetchData = async () => {
    const response = await fetch(
      'https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/user?email='+email,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        },
      }
    );
    const result = await response.json();
    if (response.status === 200) {
      setNickname(result.nickname);
      setPhoneNumber(result.phone);
      setImage(result.profileImage);
      setPreviewImageSrc(result.profileImage);
      console.log(result.profileImage);

    } else {
      console.log("실패");
    }
  };

  fetchData();
  }, []);


  // form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

  // Check if passwords match
  if (password !== passwordConfirm) {
    alert("비밀번호가 일치하지 않습니다.");
  return;
  }

    // Create payload
    const payload = {
      email: email,
      nickname: nickname,
      phone: phoneNumber,
      password: password,
    };

    try {
      const response = await fetch(
        " https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/user",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        // Redirect to login.html
        console.log("성공!");
      } else if (response.status === 400) {
        // Handle error
        alert(`실패`);
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }



    var formData = new FormData();
        formData.append('image', image); // 이미지
        console.log(formData);
        // formData에 이미지와 json을 합친
        for (let value of formData.values()) {
            if (value instanceof Blob) {
                var reader = new FileReader();
                reader.onload = function () {
                    console.log(reader.result); // Blob 내부 데이터를 콘솔에 출력
                };
                reader.readAsText(value);
            } else {
                console.log(value);
            }
        }
        fetch('https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/user/image?email='+email, {
            method: 'POST',
            headers: {
                "Authorization": `${token}`
            },
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    return response.json(); // JSON 형식의 응답을 파싱
                }
                throw new Error('네트워크 응답이 실패했습니다.');
            })
            .then(data => {
                alert('성공!');
            })
            .catch(error => {
                console.error(error);
            });


    console.log({nickname, phoneNumber, password, image });
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
            placeholder="새로운 비밀번호 입력"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <label>비밀번호 확인</label>
        <div className="userEdit-password-confirm">
          <input
            type="password"
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
