import adImage1 from "../adImages/ad1.png";
import adImage2 from "../adImages/ad2.png";
import adImage3 from "../adImages/ad3.png";

import AdComponent from "../components/AdComponent";
import BottomNav from "../components/BottomNav";
import CardList from "../components/CardList";
import Header from "../components/Header";

export default function Home() {
  const adImages = [
    { id: "1", src: adImage1 },
    { id: "2", src: adImage2 },
    { id: "3", src: adImage3 },
    // 추가 이미지 경로
  ];

  return (
    <div className="home">
      <Header />
      <div className="ad-image-container">
        <AdComponent images={adImages} />
      </div>
      <CardList />
      <BottomNav />
    </div>
  );
}
