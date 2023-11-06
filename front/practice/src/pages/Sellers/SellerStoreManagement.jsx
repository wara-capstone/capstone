import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "./Seller.css";
import SellerHeader from "./SellerHeader";

const { kakao } = window;
const token = sessionStorage.getItem("token");

var map;
var geocoder;
var marker;

const SellerStoreManagement = ({ store }) => {
  const [name, setName] = useState(store?.name || "");
  const [location, setLocation] = useState(store?.location || "");
  const [content, setContent] = useState(store?.content || "");
  var coord;

  const [image, setImage] = useState();
  const [previewImageSrc, setPreviewImageSrc] = useState(
    store?.profileImage || "https://via.placeholder.com/150x150"
  );

  useEffect(() => {
    var mapDiv = document.querySelector("#storeMap"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(35.856047838165004, 128.49278206824263), // 지도의 중심좌표 (35.8678658, 128.5967954)
        level: 3, // 지도의 확대 레벨
      };
    //mapDiv에 첫번째 자식이 없다면 지도 생성
    if (!mapDiv.firstChild) {
      map = new kakao.maps.Map(mapDiv, mapOption); // 지도를 생성합니다
    }

    geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체를 생성합니다
  }, []);

  // form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement the code to send updated data to the server
    console.log({ name, location, content, image });

    var data = {
      storeName: name,
      storeAddress: location,
      storeContent: content,
    };
    var formData = new FormData();
    formData.append("image", image); // 이미지
    formData.append(
      "data",
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
    fetch(
      "https://port-0-creativefusion-jvpb2aln5qmjmz.sel5.cloudtype.app/store/create",
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json(); // JSON 형식의 응답을 파싱
        }
        throw new Error("네트워크 응답이 실패했습니다.");
      })
      .then((data) => {
        alert("성공!");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // image change handler
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreviewImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  function searchAddress() {
    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(location, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        if (marker) {
          // 이전에 생성된 마커가 있으면
          marker.setMap(null); // 마커를 지도에서 제거
        }
        coord = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        marker = new kakao.maps.Marker({
          map: map,
          position: coord,
        });
        map.panTo(coord);
      }
    });
  }

  return (
    <div className="seller-store-management" style={{ position: "relative" }}>
      <SellerHeader />
      <div
        id="storeMap"
        style={{ width: "100%", height: "91vh", zIndex: "0" }}
      ></div>
      <form
        onSubmit={handleSubmit}
        style={{ position: "absolute", top: 40, left: 0, zIndex: "2" }}
      >
        <div className="store-edit-info-container" style={{ width: "70%" }}>
          <div className="store-edit-image">
            <img
              src={previewImageSrc}
              alt="프로필 사진"
              style={{ height: "33vh" }}
            />
            <label className="store-edit-icon">
              <FontAwesomeIcon icon={faPlus} />
              <input
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
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

          <label>가게 정보</label>
          <div className="store-edit-content">
            <input
              type="text"
              value={content}
              placeholder="가게 정보 입력"
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button className="store-save-button">저장하기</button>
        </div>
      </form>
    </div>
  );
};

// return (
//   <div className="seller-store-management">
//     <SellerHeader />
//     <div style={{ display: "flex", flexDirection: "row", justifyContent: "center"}}> {/* 이 부분을 추가합니다 */}
//     <form onSubmit={handleSubmit} style={{ marginRight: "10%" }}>
//       <div className="store-edit-info-container" style={{width: "100%"}}>
//         <div className="store-edit-image">
//           <img src={previewImageSrc} alt="프로필 사진" />
//           <label className="store-edit-icon">
//             <FontAwesomeIcon icon={faPlus} />
//             <input
//               type="file"
//               onChange={handleImageChange}
//               style={{ display: "none" }}
//             />
//           </label>
//         </div>
//         <label>가게 이름</label>
//         <div className="store-edit-name">
//           <input
//             type="text"
//             value={name}
//             placeholder="가게 이름 입력"
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>

//         <label>가게 주소</label>
//         <div className="store-edit-location">
//           <input
//             type="text"
//             value={location}
//             placeholder="가게 주소 입력"
//             onChange={(e) => setLocation(e.target.value)}
//             onBlur={searchAddress}
//           />
//         </div>

//         <label>가게 정보</label>
//         <div className="store-edit-content">
//           <input
//             type="text"
//             value={content}
//             placeholder="가게 정보 입력"
//             onChange={(e) => setContent(e.target.value)}
//           />
//         </div>
//         {/* submit button */}
//         <button className="store-save-button">저장하기</button>
//       </div>
//     </form>
//     <div id="storeMap"style={{border: "0", boxShadow: "0px 0px 15px rgba(0,0,0,0.15)"}}></div>
//     </div>
//   </div>
// );
// };

export default SellerStoreManagement;
