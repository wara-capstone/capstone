import { Link } from "react-router-dom";
import Data from "../DB/Data.json";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card"; // Card 컴포넌트 임포트
import EventButton from "../components/EventButton";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PurchaseProduct from "../components/PurchaseProduct";
import "../components/CartComponents.css";

export default function Purchase() {
  const location = useLocation();
    // const { selectedBread, checkList } = location.state;


    var a =  [  {
      "option": "빨강",
      "id": 1,
      "number": 1,
      "order_price" : 10000,
      "order_type": "빵",
      "title": "Item 5",
      "content": "Item Detail 5",
      "content2": 1,
      "subTitle": "10,000₩",
      "isCartItems": true
    },
    {
      "id": 2,
      "number": 2,
      "order_price" : 20000,
      "order_type": "떡",
      "title": "Item 5",
      "content": "Item Detail 5",
      "content2": 1,
      "subTitle": "20,000₩",
      "isCartItems": true
    },
  
  ];

  const [selectedBread, setSelectedBread] = useState (a);
  const [checkList, setCheckList] = useState(selectedBread.map(bread => bread.id));
  const CardInCart = Data.cardData.filter(
    (card) => card.isCartItems === Boolean(true)
  );



const changeSingleBox = (checked, id) => {
if (checked) {
    setCheckList([...checkList, id]);
} else {
    setCheckList(checkList.filter(el => el !== id));
}
};
    //
    // useEffect(() => {
    //     fetch('/data/breadCart.json')
    //     .then(res => res.json ())
    //     .then(json => {
    //     setSelectedBread(json);
    //     setNumberOfBread(json. length);
    // });
    // }, []);



  return (
    <div className="cart-page">
      <Header />
      <div>
        {selectedBread. length && ( 
            <div className="Cart">
    {selectedBread.map(selectedBread =>(
        <PurchaseProduct
            selectedBread={selectedBread}
            key={selectedBread.id}
            changeSingleBox={changeSingleBox}
            data={selectedBread}
            checkList={checkList}
        />
        ))}
        </div>
        )}
        </div>
       <div>총 가격: 100</div>
      <EventButton buttonText={"결제"} />
      <BottomNav />
    </div>
  );
}
