import { useEffect, useState } from "react";
import imageSrc4 from "../../adImages/iconImage/iconBlue.png";
import imageSrc3 from "../../adImages/iconImage/iconRed.png";
import imageSrc from "../../adImages/iconImage/shopBlue.png";
import imageSrc2 from "../../adImages/iconImage/shopRed.png";
import "./Seller.css";
import SellerHeader from "./SellerHeader";
import SellerSideNav from "./SellerSideNav";

const { kakao } = window;

const email = sessionStorage.getItem("email");
const token = sessionStorage.getItem("token");

var map;
var geocoder;
var marker;
var markers = []; // 마커를 담을 배열
var markerList = [],
  selectedMarker = null; // 클릭한 마커를 담을 변수

var imageSize = new kakao.maps.Size(42, 56); // 마커의 크기 기존 33, 36
var choiceImageSize = new kakao.maps.Size(44, 58); // 선택한 마커의 크기 기존 38, 40

const SellerStoreManagement = ({ store }) => {
  const [name, setName] = useState(store?.name || "");
  const [location, setLocation] = useState(store?.location || "");
  const [content, setContent] = useState(store?.content || "");
  const [phone, setPhoneNum] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  var coord;

  const [image, setImage] = useState();
  const [previewImageSrc, setPreviewImageSrc] = useState(
    store?.profileImage || "https://via.placeholder.com/150x150"
  );

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
  const fetchData = async (BodyJson, latlng, initMarkers) => {
    try {
      const response = await fetch(
        "https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/store/read/map/coordinate",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: BodyJson,
        }
      );
      const { data } = await response.json();
      if (response.status === 200) {
        // 서버에서 받은 데이터를 markerList에 저장
        markerList = data;
        console.log("데이터 전송 완료");
        console.log(markerList);
        console.log(latlng);
        initMarkers();
      } else if (response.status === 400) {
        console.log("데이터 전송 실패");
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  //
  //
  //
  //
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

    var circle = new kakao.maps.Circle({
      center: mapOption.center,
      radius: 10000,
      strokeWeight: 5, // 선의 두께입니다
      strokeColor: "#75B8FA", // 선의 색깔입니다
      strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "dashed", // 선의 스타일 입니다
      fillOpacity: 0, // 채우기 불투명도 입니다
    });
    var centerAround = circle.getBounds();
    console.log(centerAround);

    // centerAround의 남서쪽과 북동쪽 좌표를 가져옵니다
    var swLatLng = centerAround.getSouthWest();
    var neLatLng = centerAround.getNorthEast();

    var circleXY = {
      minX: swLatLng.getLng(), // 남서쪽 경도
      minY: swLatLng.getLat(), // 남서쪽 위도
      maxX: neLatLng.getLng(), // 북동쪽 경도
      maxY: neLatLng.getLat(), // 북동쪽 위도
    };

    fetchData(JSON.stringify(circleXY), mapOption.center, initMarkers);
    // 지도가 이동, 확대, 축소로 인해 중심좌표가 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, "dragend", function () {
      // 지도의  레벨을 얻어옵니다
      var level = map.getLevel();
      // 지도의 중심좌표를 얻어옵니다
      var latlng = map.getCenter();

      circle.setPosition(latlng); // 지도의 중심좌표를 원의 중심으로 설정합니다
      circle.setRadius(level * 1000); // 원의 반지름을 지도의 레벨 * 1000으로 설정합니다
      circle.setMap(map); // 원을 지도에 표시합니다

      var centerAround = circle.getBounds();
      console.log(centerAround);

      swLatLng = centerAround.getSouthWest();
      neLatLng = centerAround.getNorthEast();

      circleXY = {
        minX: swLatLng.getLng(),
        minY: swLatLng.getLat(),
        maxX: neLatLng.getLng(),
        maxY: neLatLng.getLat(),
      };

      console.log(circleXY);

      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }

      // markers 배열 초기화
      markers = [];

      var BodyJson = JSON.stringify(circleXY);
      fetchData(BodyJson, latlng, initMarkers);
    });

    function initMarkers() {
      if (markerList === null) {
        console.log("데이터가 없습니다.");
        return;
      }
      markerList.forEach(function (markerInfo) {
        // 마커를 생성합니다

        // if(markerInfo.Shopping){
        // var marker = new kakao.maps.Marker({
        //     position: new kakao.maps.LatLng( markerInfo.storeLocationY,markerInfo.storeLocationX),
        //     map: map,
        //     image: shopNormalImage, // 마커 이미지
        // });
        //     marker.normalImage = shopNormalImage;
        //     marker.clickImage = shopClickImage;

        // }else{
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
          } else if (selectedMarker === marker) {
            selectedMarker.setImage(selectedMarker.normalImage);
            selectedMarker = null;
          }

          // 지도 중심을 클릭된 마커 위치로 이동
          map.panTo(
            new kakao.maps.LatLng(
              markerInfo.storeLocationY,
              markerInfo.storeLocationX
            )
          );
        });
      });
    }
    initMarkers();
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
      storeContent: content,
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
      fetch(
        "https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/store/create",
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
          console.log(data.result);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      formData = JSON.stringify(data);

      fetch(
        "https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/store/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
                      height: "10vh",
                      resize: "vertical", // 사용자가 높이를 조절할 수 있도록 함
                    }}
                  />
                </div>
                <button className="store-save-button">변경하기</button>
              </div>
            </form>
          </div>
        </div>

        <div className="store-management-map-container">
          <div className="store-management-map">
            <div
              id="storeMap"
              style={{ width: "100%", height: "91vh", zIndex: "0" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerStoreManagement;
