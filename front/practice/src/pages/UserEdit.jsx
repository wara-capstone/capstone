import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import EventButton from "../components/EventButton";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import {
  message
} from "antd";


const UserEdit = ({ user }) => {
  

  let navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const RefreshToken = localStorage.getItem("RefreshToken");

  const [nickname, setNickname] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [image, setImage] = useState("https://via.placeholder.com/150x150");
  const [previewImageSrc, setPreviewImageSrc] = useState("https://via.placeholder.com/150x150");

  const [loginCheck, setLoginCheck] = useState(false); // 로그인 상태 체크
  const [imageCheck, setImageCheck] = useState(false); // 이미지 체크

  useEffect( () => {
    console.log(token);
    console.log("위에꺼 토큰");
    const fetchData = async () => {
    const response = await fetch(
      `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}user?email=`+email,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        },
      }
    );
    const result = await response.json();
    if (response.status === 401) {
      const fetchData = async () => {
        const response = await fetch(
          `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}auth/signin`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
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
      fetchData();
    } 
    else if (response.status === 200) {
      setNickname(result.nickname);
      setPhoneNumber(result.phone);
      setImage(result.profileImage);
      setPreviewImageSrc(result.profileImage);
      console.log(result.profileImage);
    }
    else {
      console.log("실패");
      message.error("값을 불러오는데 실패하였습니다.");
      navigate("/user");
    }
  };

  fetchData();
  }, []);


  // form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

  // Check if passwords match
  if (password !== passwordConfirm) {
    //message.error("비밀번호가 일치하지 않습니다.");
    setLoginCheck(true);
    return
  } else {
    setLoginCheck(false);
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
        `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}user`,
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
        message.success("수정이 완료되었습니다.");
      } else if (response.status === 400) {
        // Handle error
        message.error("수정에 실패하였습니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      message.error("수정에 실패하였습니다.");
      navigate("/user");
    }


  if(imageCheck){
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
        fetch(`${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}user/image?email=`+email, {
            method: 'POST',
            headers: {
                "Authorization": `${token}`
            },
            body: formData
        })
            .then(response => {
                if (response.ok) {
                  setImageCheck(false);
                  navigate("/user");  // 이미지 업로드 완료 후에 페이지 이동
                    return response.json(); // JSON 형식의 응답을 파싱
                }
                throw new Error('네트워크 응답이 실패했습니다.');
            })
            // .then(data => {
            //     alert('서버로 이미지 전송 성공!');
            //     setImageCheck(false);
            //     navigate("/user");  // 이미지 업로드 완료 후에 페이지 이동
            // })
            .catch(error => {
                console.error(error);
            });
          }
          else{
            navigate("/user");
          }
    console.log({nickname, phoneNumber, password, image });
  };

  // image change handler
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreviewImageSrc(URL.createObjectURL(e.target.files[0]));
      setImageCheck(true);
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
        {loginCheck && (
        <label  style={{color: "red"}}>비밀번호가 일치하지 않습니다.</label>
        )}
      </div>

      {/* submit button */}
      <EventButton type="submit" buttonText={"저장하기"} />
      <BottomNav />
    </form>
  );
};

export default UserEdit;
