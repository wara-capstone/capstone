import { Link } from "react-router-dom";
import Data from "../DB/Data.json";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card"; // Card 컴포넌트 임포트
import Header from "../components/Header";
import KakaoMap from "../components/KakaoMap";


export default function Map() {

  return (
    <div className="map">
      <Header />
      <KakaoMap/>
      <BottomNav />
    </div>
  );
}
