import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import KakaoMap from "../components/KakaoMap";

export default function Map() {
  return (
    <div className="map">
      <Header />
      <KakaoMap />
      <BottomNav />
    </div>
  );
}
