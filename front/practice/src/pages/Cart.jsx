import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import EventButton from "../components/EventButton";
import Header from "../components/Header";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderInformation from '../components/OrderInformation';
import OrderProducts from '../components/OrderProducts';
import "../components/CartComponents.css";
import Popup from "../components/Popup";


export default function Cart({ cartItems }) {
  const [isOpen, setIsOpen] = useState(false);

  let navigate = useNavigate();

  

  const togglePopup = () => { //팝업창
    setIsOpen(!isOpen);
  };


  function asd(e) {
      console.log("구매");
       navigate("/user/purchase", { state: { selectedBread: selectedBread, checkList: checkList } } );
  }
  

    useEffect(() => {
    }
    , []);

    var a =  [  {
      "option": "빨강",//옵션
      "size": "M",//사이즈
      "id": 1,  //아이디
      "number": 1,  //수량
      "order_price" : 10000, //가격
      "order_type": "상의",
      "title": "줄무늬 티셔츠",
      "content": "Item Detail 5",
      "content2": 1,
      "subTitle": "10,000₩",
    },
    {
      "option": "빨강",
      "size": "L",
      "id": 2,
      "number": 1,
      "order_price" : 20000,
      "order_type": "하의",
      "title": "빵꾸난 청바지",
      "content": "Item Detail 5",
      "content2": 1,
      "subTitle": "20,000₩"
    },

  ];


  const [selectedBread, setSelectedBread] = useState (a);
  const [checkList, setCheckList] = useState(selectedBread.map(bread => bread.id));
  const [numberOfBread, setNumberOfBread] = useState(selectedBread.length);
  const changeSingleBox = (checked, id) => {
  if (checked) {
      setCheckList([...checkList, id]);
  } else {
      setCheckList(checkList.filter(el => el !== id));
  }
};

  const changeAllBox = checked => {
      if (checked) {
          const allCheckBox = [];
          selectedBread.forEach(el => allCheckBox.push(el.id));
          setCheckList(allCheckBox);
      } else {
          setCheckList([]);
      }
  };


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
        {selectedBread.length && ( 
        <div className="shoppingBag">
        <div className="orderContainer">
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <div>
            <label>전체선택</label>
        <OrderInformation
            changeAllBox={changeAllBox} 
            checkList={checkList} 
            numberOfBread={numberOfBread}
        />
        </div>
        <button id="normal-button">삭제</button>
        </div>
    {selectedBread.map(selectedBread =>(
        <OrderProducts
            selectedBread={selectedBread}
            key={selectedBread.id}
            changeSingleBox={changeSingleBox}
            data={selectedBread}
            checkList={checkList}
        />
        ))}
        </div>
        </div>

        )}


      <EventButton buttonText={"구매하기"} onClick={asd}/>
      <BottomNav />
    </div>
  );
}
