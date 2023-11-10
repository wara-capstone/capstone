import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import EventButton from "../components/EventButton";
import Header from "../components/Header";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderInformation from '../components/OrderInformation';
import OrderProducts from '../components/OrderProducts';
import "../components/CartComponents.css";
import Modal from 'react-modal';
import { faL } from "@fortawesome/free-solid-svg-icons";


export default function Cart() {
  const email = sessionStorage.getItem('email');
  const token = sessionStorage.getItem('token');
  const [modalIsOpen, setModalIsOpen] = useState(false); //팝업창

  let navigate = useNavigate();

  function purchaseFunc(e) {  //구매하기 기능
      console.log("구매");
       navigate("/user/purchase", { state: { selectedBread: selectedBread, checkList: checkList } } );
  }

const [selectedBread, setSelectedBread] = useState ([]); 
const [checkList, setCheckList] = useState();
const [numberOfBread, setNumberOfBread] = useState(0);
const [reload, setReload] = useState(false); // 장바구니 페이지 새로고침

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
        selectedBread.forEach(el => allCheckBox.push(el.cart_item_id));
        setCheckList(allCheckBox);
    } else {
        setCheckList([]);
    }
};

  useEffect(() => {
    const fetchData = async () => {
     const response = await fetch(
       'http://3.34.227.3:16000/cart/items/?user_email='+email,
       {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           "Authorization": `${token}`
         },
       }
     );
    const result = await response.json();

     if (response.status === 200) {
       console.log("성공");
       setSelectedBread(result);
       setNumberOfBread(result.length);  
       
       console.log(result);
     } else {
      console.log(response);
       console.log("실패");
     }
   };
   fetchData();

    // Event Listener 등록
  const handleOptionChange = () => setReload(Date.now());
  window.addEventListener('optionChanged', handleOptionChange);

  // Component가 unmount될 때 Event Listener 해제
  return () => window.removeEventListener('optionChanged', handleOptionChange);


 }, [reload]);


 useEffect(() => {
  const allCheckBox = [];
  selectedBread.forEach(el => allCheckBox.push(el.cart_item_id));
  setCheckList(allCheckBox);
}, [selectedBread]);

useEffect(() => {
  console.log("체크 박스 개수: "+ numberOfBread);
  console.log("체크리스트 :"+checkList);
}, [selectedBread, checkList]);



  function deleteFunc(){  //삭제 버튼 기능
    setModalIsOpen(false);
  }

  
  return (
    <div className="cart-page">
      <Header />
        {selectedBread.length && ( 
        <div className="shoppingBag">
        <div className="orderContainer">
          <div style={{display:"flex", justifyContent:"space-between"}}>
        <div style={{display:"flex"}}>
        <OrderInformation
            changeAllBox={changeAllBox} 
            checkList={checkList} 
            numberOfBread={numberOfBread}
        />
        <div style={{width:"80px"}}>
          <label>전체선택</label>
        </div>
        </div>

        <button id="normal-button" onClick={()=>setModalIsOpen(true)}>삭제</button>
        </div>

        <Modal className='Modal' isOpen={modalIsOpen} onRequestClose={()=> setModalIsOpen(false)}>
        현재 선택된 상품을
        삭제하시겠습니까?
        <div style={{display:"flex"}}>
        <button className="changeOption" onClick={deleteFunc}>취소</button> 
        <button className="changeOption" style={{backgroundColor:"blue", color:"white"}}>삭제</button>
        </div>
      </Modal>
    {selectedBread.map(data =>
    (
        <OrderProducts
            selectedBread={selectedBread}
            key={data.cart_item_id}
            changeSingleBox={changeSingleBox}
            data={data}
            checkList={checkList}
        />
        ))}
        </div>
        </div>

        )}
      <EventButton buttonText={"구매하기"} onClick={purchaseFunc}/>
      <BottomNav />
    </div>
  );
}
