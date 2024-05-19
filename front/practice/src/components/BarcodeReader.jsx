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
    codeReader.listVideoInputDevices().then((devices) => {
      // 비디오 입력 장치 목록 조회
      // 후면 카메라 선택 (일반적으로 두 번째 장치가 후면 카메라입니다)
      const rearCamera = devices.find((device) =>
        device.label.toLowerCase().includes("back")
      );

      if (rearCamera) {
        // 후면 카메라가 있으면
        setSelectedDeviceId(rearCamera.deviceId); // 후면 카메라를 선택
      } else {
        // 후면 카메라가 없으면 첫 번째 장치를 선택
        setSelectedDeviceId(devices[0]?.deviceId || "");
      }

      setProducts([Data.cardData[1]]); // 제품 목록 설정
    });

    const handleUnload = () => {
      // 페이지가 언로드될 때 실행할 핸들러
      codeReader.reset(); // 바코드 리더 초기화
    };

    window.addEventListener("unload", handleUnload); // 언로드 이벤트 리스너 등록

    return () => {
      // 컴포넌트가 언마운트될 때 실행
      codeReader.reset(); // 바코드 리더 초기화
      window.removeEventListener("unload", handleUnload); // 언로드 이벤트 리스너 제거
    };
  }, [codeReader]); // codeReader가 바뀔 때마다 효과를 재실행

  useEffect(() => {
    if (selectedDeviceId) {
      startDecoding(selectedDeviceId); // 선택된 장치 ID가 변경될 때 디코딩 시작
    }
  }, [selectedDeviceId]);

  const resetDecoding = () => {
    // 디코딩 리셋 함수
    codeReader.reset(); // 바코드 리더 초기화
    setResult(""); // 결과 초기화
    setShowModal(false); // 모달 숨김
    setIsBarcodeDetected(false); // 바코드 인식 상태 리셋
    // 바코드 리더를 리셋한 후에 다시 스캔 시작
    startDecoding(selectedDeviceId);
  };

  const userId = localStorage.getItem("email"); // 세션 스토리지에서 이메일(사용자 ID) 가져오기
  const navigate = useNavigate(); // navigate 함수 사용
  const handleAddCart = () => {
    // 장바구니 추가 핸들러
    if (userId === null) {
      // 사용자 ID가 없으면
      navigate("/login"); // 로그인 페이지로 이동
    }
  };

  const selectedCard = Data.cardData.filter(
    // 선택된 카드 필터링
    (card) => card.id.toString() === result // 카드 ID가 결과와 같으면 선택
  );

  const fetchProductInfo = async (productId, optionId) => {
    //Get
    // if(productId == null ){return}
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
      if (response.status == 200) {
        console.log(response.data);
      } else {
        console.log("잘못된 요청");
        response.data = { result: "실패!" };
      }

      console.log("받아온 값:" + JSON.stringify(response.data)); // 서버로부터 받아온 데이터를 JSON 문자열로 변환하여 출력

      // 받아온 데이터를 파싱하여 변수에 저장

      return response.data;
    } catch (error) {
      console.error("에러가 발생했습니다!", error);
    }
  };

  const startDecoding = (id) => {
    // 디코딩 시작 함수
    codeReader.decodeFromVideoDevice(
      id,
      videoRef.current,
      async (result, err) => {
        // 비디오 장치에서 바코드 디코딩
        if (result) {
          // 결과가 있으면
          console.log(result); // 결과 로깅
          var data = result.text.split("A");

          fetchedProductInfo = await fetchProductInfo(data[0], data[1]); // 서버에서 바코드에 해당하는 제품 정보 가져오기
          setProductInfo(fetchedProductInfo); // 제품 정보를 productInfo 상태 변수에 저장
          setResult(fetchedProductInfo); // 결과 설정
          setShowModal(true); // 모달 표시
          setIsBarcodeDetected(true); // 바코드 인식 상태 설정

          // 스캔이 완료된 후에 바코드 리더를 리셋하고 다시 스캔 시작
          codeReader.reset();
          startDecoding(id);
        }
        if (err && !(err instanceof NotFoundException)) {
          // 에러가 있고, NotFoundException이 아니면
          console.error(err); // 에러 로깅
          console.error(err.message); // 오류 메시지 출력
          setResult(err.message); // 에러 메시지 설정
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
