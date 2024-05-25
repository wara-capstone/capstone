import { useEffect, useState } from "react";
import imageSrc4 from "../../adImages/iconImage/iconBlue.png";
import imageSrc3 from "../../adImages/iconImage/iconRed.png";
import imageSrc from "../../adImages/iconImage/shopBlue.png";
import imageSrc2 from "../../adImages/iconImage/shopRed.png";
import "./Seller.css";
import SellerHeader from "./SellerHeader";
import SellerSideNav from "./SellerSideNav";

const SellerStoreEdit = ({ store }) => {
  const { kakao } = window;
  var map;
  var geocoder;
  var marker;
  var markers = []; // 마커를 담을 배열

  var markerList = [],
    selectedMarker = null; // 클릭한 마커를 담을 변수

  var imageSize = new kakao.maps.Size(42, 56); // 마커의 크기 기존 33, 36
  var choiceImageSize = new kakao.maps.Size(44, 58); // 선택한 마커의 크기 기존 38, 40

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const [name, setName] = useState(store?.name || "");
  const [location, setLocation] = useState(store?.location || "");
  const [content, setContent] = useState(store?.content || "");
  const [phone, setPhoneNum] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [storeId, setStoreId] = useState(0);

  var coord;

  const [image, setImage] = useState();
  const [previewImageSrc, setPreviewImageSrc] = useState(
    store?.profileImage || "https://via.placeholder.com/150x150"
  );

  const [deleteButtonVisible, setDeleteButtonVisible] = useState(false);

  function createMarkerImage(markerScr, markerSize) {
    var markerImage = new kakao.maps.MarkerImage(markerScr, markerSize);
    return markerImage;
  }

  // 기본 마커이미지, 오버 마커이미지, 클릭 마커이미지를 생성합니다
  var shopNormalImage = createMarkerImage(imageSrc, imageSize),
    shopClickImage = createMarkerImage(imageSrc2, choiceImageSize),
    clickImage = createMarkerImage(imageSrc3, choiceImageSize),
    normalImage = createMarkerImage(imageSrc4, imageSize);

  // fetch 통신 method
  const fetchData = async (initMarkers) => {
    console.log(email);
    try {
      const response = await fetch(`${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}store/read/seller/${email}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `${token}`,
        },
      });
      const { data } = await response.json();
      if (response.status === 200) {
        // 서버에서 받은 데이터를 markerList에 저장
        markerList = data;
        console.log("데이터 전송 완료");
        console.log(markerList);
        // console.log(latlng);
        initMarkers();
      } else if (response.status === 400) {
        console.log("데이터 전송 실패");
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  // for (var i = 0; i < markers.length; i++) {
  //   markers[i].setMap(null);
  // }

  useEffect(() => {
    var mapDiv = document.querySelector("#storeMapEdit"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(35.856047838165004, 128.49278206824263), // 지도의 중심좌표 (35.8678658, 128.5967954)
        level: 3, // 지도의 확대 레벨
      };
    //mapDiv에 첫번째 자식이 없다면 지도 생성
    if (!mapDiv.firstChild) {
      map = new kakao.maps.Map(mapDiv, mapOption); // 지도를 생성합니다
    }

    geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체를 생성합니다

    fetchData(initMarkers);

    function initMarkers() {
      if (markerList === null) {
        console.log("데이터가 없습니다.");
        return;
      }
      markerList.forEach(function (markerInfo) {
        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(
            markerInfo.storeLocationY,
            markerInfo.storeLocationX
          ),
          map: map,
          image: normalImage, // 마커 이미지
        });
        marker.normalImage = normalImage;
        marker.clickImage = clickImage;
        // }
        markers.push(marker);

        // 마커에 click 이벤트를 등록합니다
        kakao.maps.event.addListener(marker, "click", function () {
          // 클릭된 마커가 없거나, click 마커가 클릭된 마커가 아니면
          // 마커의 이미지를 클릭 이미지로 변경합니다

          if (!selectedMarker || selectedMarker !== marker) {
            // 클릭된 마커 객체가 null이 아니면
            // 클릭된 마커의 이미지를 기본 이미지로 변경하고
            !!selectedMarker &&
              selectedMarker.setImage(selectedMarker.normalImage);

            // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
            marker.setImage(marker.clickImage);
            // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
            selectedMarker = marker;
            // 클릭된 마커일 때만 삭제 버튼을 보이게 하도록 설정
            setDeleteButtonVisible(true);
          } else if (selectedMarker === marker) {
            selectedMarker.setImage(selectedMarker.normalImage);
            selectedMarker = null;

            // 클릭된 마커가 해제되면 삭제 버튼을 감추도록 설정
            setDeleteButtonVisible(false);
          }

          // 지도 중심을 클릭된 마커 위치로 이동
          map.panTo(
            new kakao.maps.LatLng(
              markerInfo.storeLocationY,
              markerInfo.storeLocationX
            )
          );

          console.log(markerInfo.storeImage);

          setPhoneNum(markerInfo.storePhone);
          setLocation(markerInfo.storeAddress);
          setContent(markerInfo.storeContents);
          setName(markerInfo.storeName);
          setPreviewImageSrc(markerInfo.storeImage);
          // setImage(markerInfo.storeImage);
          setStoreId(markerInfo.storeId);
          setLat(markerInfo.storeLocationY);
          setLng(markerInfo.storeLocationX);
        });
      });
    }
  }, []);

  //
  //
  //
  //
  // form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    var data = {
      storeId: storeId,
      storeName: name,
      storeSeller: email,
      storeAddress: location,
      storePhone: phone,
      storeContents: content,
      storeLocationX: lng,
      storeLocationY: lat,
    };
    var formData;

    if (image) {
      formData = new FormData();
      formData.append("image", image);
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
            console.log(reader.result);
          };
          reader.readAsText(value);
        } else {
          console.log(value);
        }
      }

      fetch(`${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}store/update/id`, {
        method: "PUT",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("네트워크 응답이 실패했습니다.");
        })
        .then((data) => {
          alert("성공!");
          console.log(data.result);
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      formData = JSON.stringify(data);
      fetch(`${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}store/update/id`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("네트워크 응답이 실패했습니다.");
        })
        .then((data) => {
          alert("성공!");
          console.log(data.result);
          window.location.reload();
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
  //
  //
  //
  //

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
        setLat(result[0].y);
        setLng(result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        marker = new kakao.maps.Marker({
          map: map,
          position: coord,
        });
        map.panTo(coord);
      }
    });
  }

  const handleDeleteStore = async (event) => {
    // 삭제 처리 로직을 구현합니다.
    event.preventDefault();

    // 확인 창을 띄워 사용자의 응답을 받습니다.
    const confirmed = window.confirm("정말로 삭제하시겠습니까?");

    if (!confirmed) {
      // 사용자가 취소한 경우
      return;
    }

    console.log(storeId);

    fetch(`${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}store/delete/id/${storeId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("네트워크 응답이 실패했습니다.");
      })
      .then((data) => {
        alert("성공!");
        console.log(data.result);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="seller-store-management">
      <SellerHeader />
      <div className="store-management-container">
        <SellerSideNav />

        <div className="store-management-edit-container">
          <div className="store-management-edit">
            <form onSubmit={handleSubmit}>
              <div className="store-edit-info-container">
                <div className="store-edit-image">
                  <img src={previewImageSrc} alt="프로필 사진" />
                </div>
                <label>가게 이미지</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  style={{ height: "25px" }}
                />
                <label>가게 이름</label>
                <div className="store-edit-name">
                  <input
                    type="text"
                    value={name}
                    placeholder={`${name}`}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <label>가게 주소</label>
                <div className="store-edit-location">
                  <input
                    type="text"
                    value={location}
                    placeholder={`${location}`}
                    onChange={(e) => setLocation(e.target.value)}
                    onBlur={searchAddress}
                  />
                </div>

                <label>가게 전화번호</label>
                <div className="store-edit-phone">
                  <input
                    type="text"
                    value={phone}
                    placeholder={`${phone}`}
                    onChange={(e) => setPhoneNum(e.target.value)}
                  />
                </div>

                <label>가게 정보</label>
                <div className="store-edit-content">
                  <textarea
                    type="text"
                    value={content}
                    placeholder={`${content}`}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                      width: "90%", // 원하는 폭을 지정하세요.
                      height: "3.8rem",
                      resize: "vertical", // 사용자가 높이를 조절할 수 있도록 함
                    }}
                  />
                </div>
                <div
                  className="button-container"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button className="store-save-button">변경하기</button>
                  {deleteButtonVisible && (
                    <button
                      className="store-delete-button"
                      onClick={handleDeleteStore}
                    >
                      삭제하기
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="store-management-map-container">
          <div className="store-management-map">
            <div
              id="storeMapEdit"
              style={{ width: "100%", height: "92vh", zIndex: "0" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerStoreEdit;
