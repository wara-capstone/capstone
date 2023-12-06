import React, { useEffect, useState } from "react";
import "./Seller.css";
import SellerHeader from "./SellerHeader";
import SellerSideNav from "./SellerSideNav";

const { kakao } = window;

const SellerStoreRegister = ({ store }) => {

  const [map, setMap] = useState(null); // 지도 객체를 저장할 상태
  const [geocoder, setGeocoder] = useState(null);
  const [marker, setMarker] = useState(null); // 마커 객체를 저장할 상태

  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name, setName] = useState(store?.name || "");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState(store?.content || "");
  const [phone, setPhoneNum] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);  

  var coord;

  const [image, setImage] = useState();
  const [previewImageSrc, setPreviewImageSrc] = useState(
    store?.profileImage || "https://via.placeholder.com/150x150"
  );

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
    setToken(localStorage.getItem("token"));

    console.log("현재 페이지"+ localStorage.getItem("email"), localStorage.getItem("token"));

    var mapDiv = document.querySelector("#storeMap"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(35.856047838165004, 128.49278206824263), // 지도의 중심좌표 (35.8678658, 128.5967954)
        level: 3, // 지도의 확대 레벨
      };
    //mapDiv에 첫번째 자식이 없다면 지도 생성
    if (!mapDiv.firstChild) {
      setMap(new kakao.maps.Map(mapDiv, mapOption)); // 지도를 생성합니다
      console.log(map === null);
    }

    const newGeocoder = new kakao.maps.services.Geocoder();
    setGeocoder(newGeocoder); // geocoder 상태 업데이트
  }, []);

  // form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement the code to send updated data to the server
  
    var data = {
      storeName: name,
      storeSeller: email,
      storeAddress: location,
      storePhone: phone,
      storeContents: content,
      storeLocationX: lng,
      storeLocationY: lat,
    };
    var formData;
    console.log(image);
    if (image) {
      formData = new FormData();
      formData.append("image", image); // 이미지
      formData.append(
        "json",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );
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
      fetch(`${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//${process.env.REACT_APP_API_URL}store/create`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // JSON 형식의 응답을 파싱
          }
          throw new Error("네트워크 응답이 실패했습니다.");
        })
        .then((data) => {
          alert("성공!");
          console.log(data.result);
          console.log(formData);
          console.log(token);
          console.log(email);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      formData = JSON.stringify(data);

      fetch(`${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//${process.env.REACT_APP_API_URL}store/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // JSON 형식의 응답을 파싱
          }
          throw new Error("네트워크 응답이 실패했습니다.");
        })
        .then((data) => {
          alert("성공!");
          console.log(data.result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // image change handler
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreviewImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  function searchAddress() {
    console.log(location);
    console.log(geocoder === null);
    // 주소로 좌표를 검색합니다

    if (geocoder) {
    geocoder.addressSearch(location, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        if (marker) {
          // 이전에 생성된 마커가 있으면
          marker.setMap(null); // 마커를 지도에서 제거
        }
        coord = new kakao.maps.LatLng(result[0].y, result[0].x);
        setLat(result[0].y);
        setLng(result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        setMarker(new kakao.maps.Marker({
          map: map,
          position: coord,
        })
        );
        console.log(marker === null);
        map.panTo(coord);
      }
      else{
        alert("오류발생!");
      }
    });
  } else {
    console.log('geocoder가 아직 정의되지 않았습니다.');
  }

    
  }
  return (
    <div className="seller-store-register">
      <SellerHeader />
      <div className="store-register-container">
        <SellerSideNav />

        <div className="store-register-edit-container">
          <div className="store-register-edit">
            <form onSubmit={handleSubmit}>
              <div className="store-register-info-container">
                <div className="store-register-image">
                  <img src={previewImageSrc} alt="프로필 사진" />
                </div>
                <label>가게 이미지</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  style={{ height: "1.4rem" }}
                />
                <label>가게 이름</label>
                <div className="store-edit-name">
                  <input
                    type="text"
                    value={name}
                    placeholder="가게 이름 입력"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <label>가게 주소</label>
                <div className="store-edit-location">
                  <input
                    type="text"
                    value={location}
                    placeholder="가게 주소 입력"
                    onChange={(e) => setLocation(e.target.value)}
                    onBlur={searchAddress}
                  />
                </div>

                <label>가게 전화번호</label>
                <div className="store-edit-phone">
                  <input
                    type="text"
                    value={phone}
                    placeholder="가게 전화번호 입력"
                    onChange={(e) => setPhoneNum(e.target.value)}
                  />
                </div>

                <label>가게 정보</label>
                <div className="store-edit-content">
                  <textarea
                    type="text"
                    value={content}
                    placeholder="가게 정보 입력"
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                      width: "90%", // 원하는 폭을 지정하세요.
                      height: "3.8rem",
                      resize: "none"
                      //resize: "vertical", // 사용자가 높이를 조절할 수 있도록 함
                    }}
                  />
                </div>
                <button className="store-register-button">등록하기</button>
              </div>
            </form>
          </div>
        </div>

        <div className="store-register-map-container">
          <div className="store-register-map">
            <div
              id="storeMap"
              style={{ width: "100%", height: "92vh", zIndex: "0" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerStoreRegister;
