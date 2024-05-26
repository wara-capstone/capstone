import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";
import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Data from "../DB/Data.json";
import BarcodeModal from "../components/BarcodeModal";

function BarcodeReader() {
  const [videoInputDevices, setVideoInputDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [result, setResult] = useState("");
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef();
  const codeReader = useMemo(() => new BrowserMultiFormatReader(), []);
  const [products, setProducts] = useState([]);
  const [isBarcodeDetected, setIsBarcodeDetected] = useState(false);
  const { id } = useParams();
  const [productInfo, setProductInfo] = useState();
  const hints = new Map();
  const formats = [BarcodeFormat.CODE_128];
  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
  hints.set(DecodeHintType.TRY_HARDER, true);

  var fetchedProductInfo;
  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log(productInfo);
  }, [productInfo]);

  useEffect(() => {
    codeReader.listVideoInputDevices().then((devices) => {
      setVideoInputDevices(devices);

      const rearCamera = devices.find((device) =>
        device.label.toLowerCase().includes("back")
      );

      if (rearCamera) {
        setSelectedDeviceId(rearCamera.deviceId);
        startDecoding(rearCamera.deviceId);
      } else {
        setSelectedDeviceId(devices[0]?.deviceId || "");
        startDecoding(devices[0]?.deviceId || "");
      }

      setProducts([Data.cardData[1]]);
    });

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
    startDecoding(selectedDeviceId);
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
        `${process.env.NODE_ENV === "development" ? "" : ""}${
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
    const videoConstraints = {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      // width: { ideal: 1080 },
      // height: { ideal: 1920 },
      facingMode: "environment",
      deviceId: id ? { exact: id } : undefined,
      advanced: [{ focusMode: "continuous" }, { focusDistance: { ideal: 0 } }],
    };

    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        codeReader.decodeFromStream(
          stream,
          videoRef.current,
          async (result, err) => {
            if (result) {
              console.log(result);
              var data = result.text.split("A");

              fetchedProductInfo = await fetchProductInfo(data[0], data[1]);
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
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
      });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "88vh",
        position: "relative",
      }}
    >
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
