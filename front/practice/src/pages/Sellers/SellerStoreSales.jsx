import React, { useEffect, useState } from "react";
import imageSrc4 from "../../adImages/iconImage/iconBlue.png";
import imageSrc3 from "../../adImages/iconImage/iconRed.png";
import imageSrc from "../../adImages/iconImage/shopBlue.png";
import imageSrc2 from "../../adImages/iconImage/shopRed.png";
import "./Seller.css";
import SellerHeader from "./SellerHeader";
import SellerSideNav from "./SellerSideNav";

export default function SellerStoreSales({ store }) {
  const email = sessionStorage.getItem("email");
  const token = sessionStorage.getItem("token");

  const { kakao } = window;
  var map;
  var geocoder;
  var marker;
  var markers = []; // 마커를 담을 배열

  var markerList = [],
    selectedMarker = null; // 클릭한 마커를 담을 변수

  var imageSize = new kakao.maps.Size(42, 56); // 마커의 크기 기존 33, 36
  var choiceImageSize = new kakao.maps.Size(44, 58); // 선택한 마커의 크기 기존 38, 40

  const [storeId, setStoreId] = useState(0);
  const [payments, setPayments] = useState([]);
  // const storeId = 29; // 실제 storeId 값으로 대체

  var coord;

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
      const response = await fetch(
        `https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/store/read/seller/${email}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
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

          setStoreId(markerInfo.storeId);
        });
      });
    }
  }, []);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const response = await fetch(
          `https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/payment/read/store/${storeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        alert("성공!");
        console.log(data.result);

        if (data.data !== null) {
          console.log(storeId);
          console.log(data.data);
          setPayments(data.data); // 상태 업데이트
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    }

    fetchPayments();
  }, [storeId]);

  return (
    <div className="seller-store-sales">
      <SellerHeader />
      <div className="store-sales-container">
        <SellerSideNav />
        <div className="store-sales-info-container">
          <table>
            <thead>
              <tr>
                <th>결제ID</th>
                <th>상품ID</th>
                <th>OptionID</th>
                <th>가격</th>
                <th>수량</th>
                <th>결제시간</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                if (payment === null) return null;
                return (
                  <tr key={payment.paymentId}>
                    <td>{payment.paymentId}</td>
                    <td>{payment.productId}</td>
                    <td>{payment.optionId}</td>
                    <td>{payment.price}</td>
                    <td>{payment.quantity}</td>
                    <td>{payment.dateTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="store-sales-map-container">
          <div className="store-sales-map">
            <div
              id="storeMapEdit"
              style={{ width: "100%", height: "91vh", zIndex: "0" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
