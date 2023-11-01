import { Link } from "react-router-dom";
import Data from "../DB/Data.json";
import Card from "../components/Card"; // Card 컴포넌트 임포트
import KakaoMap from "../components/KakaoMap";


export default function Map() {

  return (
    <div className="map">
      <KakaoMap/>
    </div>
  );
}
