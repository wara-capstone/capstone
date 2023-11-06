import React from "react";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";

function BarcodeReader() {
  // const [videoInputDevices, setVideoInputDevices] = useState([]);
  // const [selectedDeviceId, setSelectedDeviceId] = useState('');
  // const [result, setResult] = useState('');
  // const [showModal, setShowModal] = useState(false);
  // const videoRef = useRef();
  // const codeReader = useMemo(() => new BrowserMultiFormatReader(), []);
  // const [products, setProducts] = useState([]);
  // const [isBarcodeDetected, setIsBarcodeDetected] = useState(false); // 바코드 인식 상태

  // useEffect(() => {
  //   codeReader.listVideoInputDevices().then((devices) => {
  //     setVideoInputDevices(devices);
  //     setSelectedDeviceId(devices[0]?.deviceId || '');
  //     startDecoding(devices[0]?.deviceId || ''); // 즉시 디코딩을 시작합니다.
  //     setProducts([Data.cardData[0]]);
  //   });

  //   const handleUnload = () => {
  //     codeReader.reset();
  //   };

  //   // 바코드 인식을 처리하는 함수 (이 함수는 실제 바코드 인식 로직에 맞게 수정해야 합니다)
  //   const handleBarcodeDetection = () => {
  //     // 바코드 인식 로직...
  //     // 바코드가 인식되면, setIsBarcodeDetected를 true로 설정
  //     setIsBarcodeDetected(true);
  //   };

  //   window.addEventListener('unload', handleUnload);

  //   return () => {
  //     codeReader.reset();
  //     window.removeEventListener('unload', handleUnload);
  //   };
  // }, [codeReader]);

  // // useEffect(() => {
  // //   if (selectedDeviceId) {
  // //     startDecoding();
  // //   }
  // // }, [selectedDeviceId, codeReader]);

  // const startDecoding = (id) => {
  //   codeReader.decodeFromVideoDevice(id, videoRef.current, (result, err) => {
  //     if (result) {
  //       console.log(result);
  //       setResult(result.text);
  //       setShowModal(true);
  //       setIsBarcodeDetected(true); // 바코드가 인식되면 isBarcodeDetected를 true로 설정
  //     }
  //     if (err && !(err instanceof NotFoundException)) {
  //       console.error(err);
  //       setResult(err.message);
  //     }
  //   });
  // };
  // const resetDecoding = () => {
  //   codeReader.reset();
  //   setResult('');
  //   setShowModal(false);
  //   setIsBarcodeDetected(false); // 바코드 인식을 리셋하면 isBarcodeDetected를 false로 설정
  // };

  // const selectedCard = Data.cardData.filter(card => card.id.toString() === result);

  return (
    <div>
      <Header />
      <h1>Barcode</h1>
      {/* <button onClick={resetDecoding}>Reset</button>
      {videoInputDevices.length > 0 && (
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
        >
          {videoInputDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
      )}
      <div style={{ width: '100%', height: 0, paddingBottom: '56.25%', position: 'relative', overflow: 'hidden', border: '1px solid gray' }}>
        <video ref={videoRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></video>
      </div>

      <div>

      {isBarcodeDetected && products.length > 0 && (
        <Modal message="This is Modal">
          <div className="barcode-item-data">
            {products.map((product) => (
              <Link to={`/item/${product.id}`} key={product.id} className="card-link">
                <Card
                  title={product.title}
                  subTitle={product.subTitle}
                  content={product.content}
                  content2={product.content2}
                  mainImage={product.images[0].image}
                />
              </Link>
            ))}
          </div>
        </Modal>
        )}
      </div>


      {showModal && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '1em', zIndex: 1000 }}>
          <h2>Result</h2>
          <p>{result}</p>
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      )}

 */}

      <BottomNav />
    </div>
  );
}

export default BarcodeReader;
