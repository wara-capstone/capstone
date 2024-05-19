import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Data from "../DB/Data.json";
import BarcodeModal from "../components/BarcodeModal";

function BarcodeReader() {
  const [result, setResult] = useState("");
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef();
  const codeReader = useMemo(() => new BrowserMultiFormatReader(), []);
  const [products, setProducts] = useState([]);
  const [isBarcodeDetected, setIsBarcodeDetected] = useState(false);
  const { id } = useParams();
  const [productInfo, setProductInfo] = useState();
  const token = localStorage.getItem("token");

  // 페이지 새로고침 여부 확인 및 처리
  useEffect(() => {
    const hasRefreshed = localStorage.getItem("hasRefreshed");
    if (!hasRefreshed) {
      localStorage.setItem("hasRefreshed", "true");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    console.log(productInfo);
  }, [productInfo]);

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const devices = await codeReader.listVideoInputDevices();
        const rearCamera = devices.find((device) =>
          device.label.toLowerCase().includes("back")
        );

        if (rearCamera) {
          startDecoding(rearCamera.deviceId);
        } else if (devices[0]) {
          startDecoding(devices[0].deviceId);
        }

        setProducts([Data.cardData[1]]);
      } catch (error) {
        console.error("카메라 초기화 중 오류 발생:", error);
      }
    };

    initializeCamera();

    const handleUnload = () => {
      codeReader.reset();
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      codeReader.reset();
      window.removeEventListener("unload", handleUnload);
    };
  }, [codeReader]);

  const resetDecoding = () => {
    codeReader.reset();
    setResult("");
    setShowModal(false);
    setIsBarcodeDetected(false);
    startDecoding();
  };

  const userId = localStorage.getItem("email");
  const navigate = useNavigate();
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

      console.log("받아온 값:" + JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      console.error("에러가 발생했습니다!", error);
    }
  };

  const startDecoding = (id) => {
    codeReader.decodeFromVideoDevice(
      id,
      videoRef.current,
      async (result, err) => {
        if (result) {
          console.log(result);
          var data = result.text.split("A");

          const fetchedProductInfo = await fetchProductInfo(data[0], data[1]);
          setProductInfo(fetchedProductInfo);
          setResult(fetchedProductInfo);
          setShowModal(true);
          setIsBarcodeDetected(true);

          codeReader.reset();
          startDecoding(id);
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
