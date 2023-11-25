import { Link } from "react-router-dom"; // React Router의 Link 컴포넌트 사용
import Data from "../DB/Data.json"; // 로컬 JSON 데이터
import Card from "../components/Card"; // Card 컴포넌트

// BarcodeModal 컴포넌트 정의
function BarcodeModal(props) {
  // isCartItems 속성이 true인 카드 필터링
  const CardInBarcodeModal = Data.cardData.filter(
    (card) => card.isCartItems === Boolean(true)
  );
  
// props에서 productInfo 추출
const { message, productInfo } = props;

  // // props에서 message 추출
  // const { message } = props;

  // 모달 컴포넌트 렌더링
  return (
    // 모달 컨테이너
    <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    bottom: "10%", // 뷰포트의 하단으로부터 10% 떨어진 위치에 모달을 위치시킵니다.
    left: 0,
    width: "100%",
    height: 150,
  }}
>
     
 
<div>

         <p>{message}</p>
        {/* 바코드 정보 표시 */}
        {/* <p>Product Name: {productInfo.options.productColor}</p>
        <p>Product Price: {productInfo.options.productPrice}</p> */}
        {
  // 필터링된 카드에 대해 링크와 카드 컴포넌트 렌더링
  // CardInBarcodeModal.map((card) => (
    <div className="card-link" style={{zIndex:100}}>
    <Link to={`/item/${productInfo.productId}`} key={productInfo.productId} >
      <Card
        key={productInfo.productId}
        title={productInfo.productName}
        subTitle={productInfo.productCategory}
        content={productInfo.options.productPrice}
        content2={productInfo.options.productStock}
        mainImage={productInfo.productUrls[0]}
        />
        </Link>
      </div>
      // ))
    }
  </div>
</div>
);
}

export default BarcodeModal; // BarcodeModal 컴포넌트 내보내기