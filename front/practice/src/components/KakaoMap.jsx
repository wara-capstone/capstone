import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRefreshToken } from '../utils/authUtil.jsx';

import imageSrc4 from "../adImages/iconImage/iconBlue.png";
import imageSrc3 from "../adImages/iconImage/iconRed.png";
import imageSrc from "../adImages/iconImage/shopBlue.png";
import imageSrc2 from "../adImages/iconImage/shopRed.png";
import SearchBar from "./SearchBar";

import { message } from "antd";
import Card from "../components/Card"; // Card 컴포넌트 임포트
import "./Card.css";
import "./KakaoMap.css";
import "./SearchBar.css";

const { kakao } = window;
let map; // 지도 객체
var markers = []; // 마커를 담을 배열

var searchPlace; // 검색한 장소 정보를 담을 변수

// 마커 정보를 담은 배열
var markerList = [],
  selectedMarker = null; // 클릭한 마커를 담을 변수

var imageSize = new kakao.maps.Size(42, 56); // 마커의 크기 기존 33, 36
var choiceImageSize = new kakao.maps.Size(44, 58); // 선택한 마커의 크기 기존 38, 40

export default function KakaoMap() {
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const RefreshToken = localStorage.getItem("RefreshToken");
  const CART_URL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_DJANGO_CART_URL
      : process.env.REACT_APP_API_URL;
  let [popupInfo, setPopupInfo] = useState(null); // 현재 열려있는 팝업 정보를 저장하는 변수, boolean
  let [searchText, setSearchText] = useState(""); // 검색창 값

  let prevInfo = null;
  let userMarker; // 사용자 위치 마커
  let uniqueStoreIds = []; // 중복 제거된 "store_id" 값들을 저장할 배열

  //Popup창 켜고 끄는 method
  function showPopup(info) {
    // 현재 열린 팝업 정보가 null이 아니고, 새로운 팝업이 이전 팝업과 같다면 팝업을 닫고 함수를 종료합니다.
    if (prevInfo !== null && prevInfo === info) {
      prevInfo = null;
      setPopupInfo(prevInfo);
      return;
    }

    // 그렇지 않은 경우, 즉 현재 열린 팝업이 없거나 새로운 팝업이 이전 팝업과 다르다면
    // 현재 열린 팝업 정보를 새로운 팝업 정보로 업데이트합니다
    prevInfo = info;
    setPopupInfo(prevInfo);
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${
          process.env.NODE_ENV === "development" ? "http://" : ""
        }${CART_URL}cart/items/?user_email=` + email,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const result = await response.json();

      if (response.status === 401) {
        RefreshToken = localStorage.getItem("RefreshToken");
        fetchRefreshToken(RefreshToken);
        token = localStorage.getItem("token");
      }
      
      if (response.status === 200) {
        console.log("성공");
        console.log(result);

        // "store_id" 값만 따로 추출하여 배열에 저장합니다.
        const storeIds = result.map((item) => item.store_id);
        // Set 객체를 활용하여 중복되는 값들을 제거합니다.
        uniqueStoreIds = [...new Set(storeIds)];
        console.log(uniqueStoreIds); // 중복 제거된 "store_id" 값들을 확인합니다.
      } else {
        console.log(response);
        console.log("실패");
      }
    };
    fetchData();

    // 위치 정보를 가져오는 함수
    const getLocation = new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            var lat = position.coords.latitude,
              lon = position.coords.longitude;
            var locPosition = new kakao.maps.LatLng(lat, lon);
            resolve(locPosition);
          },
          function () {
            var locPosition = new kakao.maps.LatLng(35.8678658, 128.5967954);
            resolve(locPosition);
            console.log("현재위치를 가져올 수 없습니다.");
          }
        );
      } else {
        var locPosition = new kakao.maps.LatLng(35.8678658, 128.5967954);
        resolve(locPosition);
        console.log("현재위치를 가져올 수 없습니다.");
      }
    });

    // 위치 정보를 가져온 후에 지도를 초기화하는 함수
    getLocation.then((locPosition) => {
      initKakaoMap(locPosition);
    });

    // 사용자 위치를 지속적으로 추적
    let watchId = navigator.geolocation.watchPosition(
      (position) => {
        var lat = position.coords.latitude,
          lon = position.coords.longitude;
        var locPosition = new kakao.maps.LatLng(lat, lon);

        // 이전 위치 마커가 있으면 지도에서 제거
        if (userMarker) {
          userMarker.setMap(null);
        }

        // 사용자의 위치에 마커 표시
        userMarker = new kakao.maps.Marker({
          map: map,
          position: locPosition,
        });
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: Infinity,
      }
    );
    // 컴포넌트가 unmount될 때 위치 추적을 중지
    return () => navigator.geolocation.clearWatch(watchId);
  }, [token]);

  // MakrerImage 객체를 생성하여 반환하는 함수입니다
  function createMarkerImage(markerScr, markerSize) {
    var markerImage = new kakao.maps.MarkerImage(markerScr, markerSize);
    return markerImage;
  }

  // 기본 마커이미지, 오버 마커이미지, 클릭 마커이미지를 생성합니다
  var shopNormalImage = createMarkerImage(imageSrc, imageSize),
    shopClickImage = createMarkerImage(imageSrc2, choiceImageSize),
    clickImage = createMarkerImage(imageSrc3, choiceImageSize),
    normalImage = createMarkerImage(imageSrc4, imageSize);

  // 키워드 검색 완료 시 호출되는 콜백함수 입니다
  function placesSearchCB(data, status) {
    if (status === kakao.maps.services.Status.OK) {
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      var bounds = new kakao.maps.LatLngBounds();

      for (var i = 0; i < 1; i++) {
        bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
      }

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds);
    }
  }
  // fetch 통신 method
  const fetchData = async (BodyJson, latlng, initMarkers) => {
    try {
      const response = await fetch(
        `${process.env.NODE_ENV === "development" ? "http://" : ""}${
          process.env.REACT_APP_API_URL
        }store/read/map/coordinate`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: BodyJson,
        }
      );
      if (response.status === 200) {
        const { data } = await response.json();
        // 서버에서 받은 데이터를 markerList에 저장
        markerList = data;
        console.log("데이터 전송 완료");
        console.log(markerList);
        message.success(`주변에 상점이 ${markerList.length}개 존재합니다.`, 2);
        initMarkers();
      } else if (response.status === 400) {
        message.error("발견된 상점이 존재하지 않습니다.", 2);
        console.log("데이터 전송 실패");
      }
    } catch (error) {
      message.error("잘못된 요청입니다.");
      console.error("오류 발생:", error);
    }
  };

  function initKakaoMap(locPosition) {
    const mapDiv = document.querySelector("#map");
    mapDiv.async = true;

    const options = {
      center: locPosition,
      level: 1,
    };

    //mapDiv에 첫번째 자식이 없다면 지도 생성
    if (!mapDiv.firstChild) {
      map = new kakao.maps.Map(mapDiv, options);

      // 장소 검색 객체를 생성합니다
      const ps = new kakao.maps.services.Places();

      // 원을 생성합니다
      var circle = new kakao.maps.Circle({
        center: options.center,
        radius: 10000,
        strokeWeight: 5, // 선의 두께입니다
        strokeColor: "#75B8FA", // 선의 색깔입니다
        strokeOpacity: 0, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
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

      fetchData(JSON.stringify(circleXY), options.center, initMarkers);

      var prevLatlng; // 이전 중심 좌표를 저장할 변수

      searchPlace = (place) => {
        // 키워드로 장소를 검색합니다
        ps.keywordSearch("대구" + place, placesSearchCB);
      };

      // 지도가 이동, 확대, 축소로 인해 중심좌표가 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
      kakao.maps.event.addListener(map, "dragend", function () {
        // 지도의  레벨을 얻어옵니다
        var level = map.getLevel();
        // 지도의 중심좌표를 얻어옵니다
        var latlng = map.getCenter();

        circle.setPosition(latlng); // 지도의 중심좌표를 원의 중심으로 설정합니다
        circle.setRadius(level * 1000); // 원의 반지름을 지도의 레벨 * 1000으로 설정합니다
        circle.setMap(map); // 원을 지도에 표시합니다

        // 이전 중심 좌표가 있고, 새로운 중심 좌표와의 차이가 0.1 미만이면 AJAX 요청을 보내지 않습니다
        if (
          prevLatlng &&
          Math.abs(prevLatlng.getLat() - latlng.getLat()) < 0.01 &&
          Math.abs(prevLatlng.getLng() - latlng.getLng()) < 0.01
        ) {
          return;
        }
        // 새로운 중심 좌표를 이전 중심 좌표로 저장합니다
        prevLatlng = latlng;

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
          if (uniqueStoreIds.includes(markerInfo.storeId)) {
            // 중복되는 "store_id" 값이 있다면
            console.log("중복된 값이 있습니다.");
            var marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(
                markerInfo.storeLocationY,
                markerInfo.storeLocationX
              ),
              map: map,
              image: shopNormalImage, // 마커 이미지
            });
            marker.normalImage = shopNormalImage;
            marker.clickImage = shopClickImage;
          } else {
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
          }
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
            showPopup(markerInfo);

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

      map.setCenter(options.center); // 지도 중심을 이동
    }
  }

  // 검색창 값 변환
  function myFunction(event) {
    event.preventDefault();
    var searchValue = searchText;
    searchPlace(searchValue);
  }

  return (
    <div style={{ position: "relative" }}>
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        onSubmit={myFunction}
        style={{ position: "absolute", top: "0", left: "0", right: "0" }}
      />
      <div id="map" style={{ width: "100%", height: "88vh", zIndex: "0" }} />

      {/* 팝업 정보가 있을 때만 Card 컴포넌트 렌더링 */}

      {popupInfo && (
        <div className="map-store-data" id="popup" style={{ zIndex: 100 }}>
          <Link
            to={`/store/${popupInfo.storeId}`}
            key={popupInfo.storeId}
            className="card-link"
          >
            <Card
              title={popupInfo.storeName}
              subTitle={popupInfo.storeAddress}
              content2={popupInfo.storePhone}
              mainImage={popupInfo.storeImage}
              id={popupInfo.storeId}
            />
          </Link>
        </div>
      )}
    </div>
  );
}
