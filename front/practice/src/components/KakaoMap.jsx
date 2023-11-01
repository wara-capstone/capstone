import { click } from "@testing-library/user-event/dist/click";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import imageSrc from "../adImages/iconImage/shopBlue.png";
import imageSrc2 from "../adImages/iconImage/shopRed.png";
import imageSrc3 from "../adImages/iconImage/iconRed.png";
import imageSrc4 from "../adImages/iconImage/iconBlue.png";
import SearchBar from "./SearchBar";

import Data from "../DB/Data.json";


import Card from "../components/Card"; // Card 컴포넌트 임포트
import "./SearchBar.css";
import "./Card.css"
import "./KakaoMap.css"


const { kakao } = window;
let map; // 지도 객체

var searchPlace; // 검색한 장소 정보를 담을 변수


var imageSize = new kakao.maps.Size(42, 56); // 마커의 크기 기존 33, 36
var choiceImageSize = new kakao.maps.Size(44, 58); // 선택한 마커의 크기 기존 38, 40



export default function KakaoMap() {


let [popupInfo, setPopupInfo] = useState(null); // 현재 열려있는 팝업 정보를 저장하는 변수, boolean
let prevInfo = null;
    
//Popup창 켜고 끄는 method
function showPopup(info) {

    // 현재 열린 팝업 정보가 null이 아니고, 새로운 팝업이 이전 팝업과 같다면 팝업을 닫고 함수를 종료합니다.
    if(prevInfo !== null && prevInfo.key === info.key){
        prevInfo = null;
        setPopupInfo(prevInfo);
        console.log("같은 팝업일때");
        return;
    }

    // 그렇지 않은 경우, 즉 현재 열린 팝업이 없거나 새로운 팝업이 이전 팝업과 다르다면
    // 현재 열린 팝업 정보를 새로운 팝업 정보로 업데이트합니다
    prevInfo = info;
    setPopupInfo(prevInfo);

    console.log("다른 팝업일때");
    console.log("이전 팝업: "+prevInfo.key);
    console.log("지금 선택한 팝업: "+ info.key);

}

    

    useEffect(() => {
        // 지도 생성 및 기타 작업 수행
        ininKakaoMap();
        }, []);



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


// 마커 정보를 담은 배열
var markerList = [
    { "lat" : 35.8678658, "lon": 128.5967954, "Shopping": true,
    "place": "빨간바지", // 상점위치 string
    "address" : "대구 중구 동성로2길 48", // 주소 string
    "storeItem" : "장바구니 물품 존재 - 아우터 외 2개", // 물건 string
    "key": 1
  },
    { "lat": 35.8709820, "lon": 128.5926346, "Shopping": true,
    "place": "한우장설렁탕", // 상점위치 string
    "address" : "대구 중구 국채보상로 567", // 주소 string
    "storeItem" : "장바구니 물품 존재 - 설렁탕", // 물건 strin
    "key": 2,
   },
    { "lat": 35.8704173, "lon": 128.5953787, "Shopping": false,
    "place": "CGV 대구한일", // 상점위치 string
    "address" : "대구광역시 중구 동성로 39", // 주소 string
    "storeItem" : "장바구니 물품 없음", // 물건 string
    "key": 3
  }
  ],
  selectedMarker = null; // 클릭한 마커를 담을 변수

  // 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {
    
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x) 
    });

}


  // 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        var bounds = new kakao.maps.LatLngBounds();

        for (var i=0; i<1; i++) {
            displayMarker(data[i]);    
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
    } 
}

function ininKakaoMap() {
    
    const mapDiv = document.querySelector("#map");
    mapDiv.async = true;

    const options = {
        center: new kakao.maps.LatLng(35.8678658, 128.5967954),
        level: 1,
        };

        //mapDiv에 첫번째 자식이 없다면 지도 생성
        if(!mapDiv.firstChild){
        map = new kakao.maps.Map(mapDiv, options);
        

        const ps = new kakao.maps.services.Places();

        var circle = new kakao.maps.Circle({
            center : options.center,
            radius: 100,
            strokeWeight: 5, // 선의 두께입니다 
            strokeColor: '#75B8FA', // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'dashed', // 선의 스타일 입니다
            fillOpacity: 0  // 채우기 불투명도 입니다 
        
        }); 
        var centerAround = circle.getBounds(); 
        console.log(centerAround);



// centerAround의 남서쪽과 북동쪽 좌표를 가져옵니다
var swLatLng = centerAround.getSouthWest();
var neLatLng = centerAround.getNorthEast();

var circleXY = { 
    "minX" : swLatLng.getLng(), // 남서쪽 경도
    "minY" : swLatLng.getLat(), // 남서쪽 위도
    "maxX" : neLatLng.getLng(), // 북동쪽 경도
    "maxY" : neLatLng.getLat(), // 북동쪽 위도
};

var prevLatlng// 이전 중심 좌표를 저장할 변수

// 지도가 이동, 확대, 축소로 인해 중심좌표가 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'center_changed', function() {

    // 지도의  레벨을 얻어옵니다
    var level = map.getLevel();

    // 지도의 중심좌표를 얻어옵니다 
    var latlng = map.getCenter();   


    circle.setPosition(latlng); // 지도의 중심좌표를 원의 중심으로 설정합니다
    circle.setRadius(level * 1000); // 원의 반지름을 지도의 레벨 * 1000으로 설정합니다
    circle.setMap(map); // 원을 지도에 표시합니다

    // 이전 중심 좌표가 있고, 새로운 중심 좌표와의 차이가 0.1 미만이면 AJAX 요청을 보내지 않습니다
    if (prevLatlng && Math.abs(prevLatlng.getLat() - latlng.getLat()) < 0.1 && Math.abs(prevLatlng.getLng() - latlng.getLng()) < 0.1) {
        return;
    }
    // 새로운 중심 좌표를 이전 중심 좌표로 저장합니다
    prevLatlng = latlng;

    var centerAround = circle.getBounds();
    console.log(centerAround);

    swLatLng = centerAround.getSouthWest();
    neLatLng = centerAround.getNorthEast();

    circleXY = {
    "minX" : swLatLng.getLng(),
    "minY" : swLatLng.getLat(),
    "maxX" : neLatLng.getLng(),
    "maxY" : neLatLng.getLat(),
};
});


        searchPlace = (place)=>{
        // 키워드로 장소를 검색합니다
        ps.keywordSearch("대구" + place, placesSearchCB); 
        }


markerList.forEach(function(markerInfo) {
// 마커를 생성합니다

if(markerInfo.Shopping){
var marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(markerInfo.lat, markerInfo.lon),
    map: map,
    image: shopNormalImage, // 마커 이미지
});
    marker.normalImage = shopNormalImage;
    marker.clickImage = shopClickImage;

}else{
    var marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(markerInfo.lat, markerInfo.lon),
        map: map,
        image: normalImage, // 마커 이미지
        
    });
    marker.normalImage = normalImage;
    marker.clickImage = clickImage;
}

    // 마커에 click 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
        // 클릭된 마커가 없거나, click 마커가 클릭된 마커가 아니면
        // 마커의 이미지를 클릭 이미지로 변경합니다

        if (!selectedMarker || selectedMarker !== marker) {

            // 클릭된 마커 객체가 null이 아니면
            // 클릭된 마커의 이미지를 기본 이미지로 변경하고
            !!selectedMarker && selectedMarker.setImage(selectedMarker.normalImage);

            // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
            marker.setImage(marker.clickImage);
            // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
            selectedMarker = marker;

        }else if(selectedMarker === marker){
            selectedMarker.setImage(selectedMarker.normalImage);
            selectedMarker = null;
        }
        showPopup(markerInfo);
        
    
    });
});
map.setCenter(options.center); // 지도 중심을 이동
        }

}

// 검색창 값 변환
function myFunction(event) {
    event.preventDefault();
    var searchValue = document.getElementById("searchBox").value;
    document.getElementById("result").innerHTML = "You entered: " + searchValue;
    searchPlace(searchValue);
  }

    return (
        <div style={{position: 'relative'}}>
            <SearchBar onSubmit={myFunction} style={{position: 'absolute',  top: '0', left: '0', right: '0'}}/>
            <div id="map" style={{ width: "100%", height: "88vh",zIndex:"0"}}/>

        {/* 팝업 정보가 있을 때만 Card 컴포넌트 렌더링 */}
        
        {popupInfo && (
            <div className="map-store-data" id ="popup" style={{ zIndex: 100 }}>
                <Link to={`/store/${popupInfo.key}`} key={popupInfo.key} className="card-link">
                <Card
                    title={popupInfo.place}
                    subTitle={popupInfo.address}
                    content={popupInfo.storeItem}
                    mainImage={imageSrc}
                    id={popupInfo.id}
                />
                </Link>
            </div>
        )}

    
        </div>
        
        )
        
}




