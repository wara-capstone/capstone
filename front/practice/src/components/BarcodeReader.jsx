import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library"; // ZXing 라이브러리 (바코드 및 QR 코드 리더)
import React, { useEffect, useMemo, useRef, useState } from "react";
import Data from "../DB/Data.json"; // 로컬 JSON 데이터

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // React Router의 Navigate, useParams 사용
import BarcodeModal from "../components/BarcodeModal"; // 바코드 모달 컴포넌트

function BarcodeReader() {
  const [selectedDeviceId, setSelectedDeviceId] = useState(""); // 선택된 비디오 입력 장치 ID
  const [result, setResult] = useState(""); // 바코드 결과
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부
  const videoRef = useRef(); // 비디오 요소 참조
  const codeReader = useMemo(() => new BrowserMultiFormatReader(), []); // 바코드 리더 인스턴스
  const [products, setProducts] = useState([]); // 제품 목록
  const [isBarcodeDetected, setIsBarcodeDetected] = useState(false); // 바코드 인식 여부
  const { id } = useParams(); // URL 파라미터에서 ID 가져오기
  const [productInfo, setProductInfo] = useState();
  const hints = new Map();
  const formats = [BarcodeFormat.CODE_128];
  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
  var fetchedProductInfo;
  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log(productInfo);
  }, [productInfo]);

  useEffect(() => {
    const initializeCamera = async () => {
      const devices = await codeReader.listVideoInputDevices(); // 비디오 입력 장치 목록 조회
      const rearCamera = devices.find((device) =>
        device.label.toLowerCase().includes("back")
      );

      if (rearCamera) {
        setSelectedDeviceId(rearCamera.deviceId); // 후면 카메라를 선택
        startDecoding(rearCamera.deviceId); // 후면 카메라로 디코딩 시작
      } else if (devices[0]) {
        setSelectedDeviceId(devices[0].deviceId); // 첫 번째 장치를 선택
        startDecoding(devices[0].deviceId); // 첫 번째 장치로 디코딩 시작
      }

      setProducts([Data.cardData[1]]); // 제품 목록 설정
    };

    initializeCamera(); // 초기화 함수 호출

    const handleUnload = () => {
      codeReader.reset(); // 페이지가 언로드될 때 바코드 리더 초기화
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      codeReader.reset();
      window.removeEventListener("unload", handleUnload);
    };
  }, [codeReader]); // codeReader가 바뀔 때마다 효과를 재실행

  const resetDecoding = () => {
    codeReader.reset(); // 바코드 리더 초기화
    setResult(""); // 결과 초기화
    setShowModal(false); // 모달 숨김
    setIsBarcodeDetected(false); // 바코드 인식 상태 리셋
    startDecoding(selectedDeviceId); // 디코딩 다시 시작
  };

  const userId = localStorage.getItem("email"); // 세션 스토리지에서 이메일(사용자 ID) 가져오기
  const navigate = useNavigate(); // navigate 함수 사용
  const handleAddCart = () => {
    if (userId === null) {
      navigate("/login");
    }
  };

  const selectedCard = Data.cardData.filter(
    (card) => card.id.toString() === result
  );

  const fetchProductInfo = async (productId, optionId) => {
    try {
      const response = await axios.get(
        `${process.env.NODE_ENV === "development" ? "http://" : ""}${
          process.env.REACT_APP_API_URL
        }product/all/${productId}/option/${optionId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
      } else {
        console.log("잘못된 요청");
        response.data = { result: "실패!" };
      }

      console.log("받아온 값:" + JSON.stringify(response.data)); // 서버로부터 받아온 데이터를 JSON 문자열로 변환하여 출력

      return response.data;
    } catch (error) {
      console.error("에러가 발생했습니다!", error);
    }
  };

  const startDecoding = async (id) => {
    await codeReader.decodeFromVideoDevice(
      id,
      videoRef.current,
      async (result, err) => {
        if (result) {
          console.log(result);
          var data = result.text.split("A");

          fetchedProductInfo = await fetchProductInfo(data[0], data[1]); // 서버에서 바코드에 해당하는 제품 정보 가져오기
          setProductInfo(fetchedProductInfo); // 제품 정보를 productInfo 상태 변수에 저장
          setResult(fetchedProductInfo); // 결과 설정
          setShowModal(true); // 모달 표시
          setIsBarcodeDetected(true); // 바코드 인식 상태 설정

          codeReader.reset(); // 스캔이 완료된 후 바코드 리더를 리셋
          startDecoding(id); // 디코딩 다시 시작
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error(err);
          console.error(err.message);
          setResult(err.message);
        }
      }
    );
  };

  return (
    <div style={{ width: "100%", height: "88vh", position: "relative" }}>
      <video
        ref={videoRef}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      ></video>

      {isBarcodeDetected && products.length > 0 && (
        <BarcodeModal productInfo={productInfo}></BarcodeModal>
      )}
    </div>
  );
}

export default BarcodeReader;
