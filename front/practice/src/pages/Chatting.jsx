import React, { useEffect, useState, useRef } from "react";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";

export default function Chatting() {
  // const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [socket, setSocket] = useState(null);
  // const [visitorUserEmail, setVisitorUserEmail] = useState(null);
  // const [sortedEmails, setSortedEmails] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const location = useLocation();// 채팅방으로 넘어온 값

  // location.state.seller를 통해 storeData.storeSeller 값 받아옴
  const seller = location.state.seller;
  

  const userId = sessionStorage.getItem("email");
  var sellerId = seller;

  useEffect(() => {
    openOrCreateRoom(userId);
  }, []);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {  //스크롤 내리는 함수
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);  // 메시지가 추가될 때마다 스크롤 내리기

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const openOrCreateRoom = async () => {
    if (socket) {
      socket.close();
    }

    // const newSortedEmails = [currentUserEmail, visitorUserEmail].sort();
    // setSortedEmails(newSortedEmails);

    try {
      const response = await fetch("http://3.34.227.3:14000/chat/rooms/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop_user_email: sellerId,
          visitor_user_email: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const roomData = await response.json();
      if (response.status === 200) {
        setCurrentRoomId(roomData.id);
        displayMessages(roomData.messages);
        setupWebSocket(roomData.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const displayMessages = (messages) => {
    console.log("h1");
    const messageElements = messages.map((message) => {
      if (message.sender_email && message.text) {
        const className = message.sender_email === userId ? "sent" : "received";
        return (
          <div key={message.id} className={`message-bubble ${className}`}>
            {`${message.sender_email}: ${message.text}`}
          </div>
        );
      }
      return null;
    });
    setChatMessages(messageElements);
  };

  const setupWebSocket = (roomId) => {
    const newSocket = new WebSocket(
      `ws://3.34.227.3:14000/ws/room/${roomId}/messages`
    );
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const className = data.sender_email === userId ? "sent" : "received";
      const messageElem = (
        <div className={`message-bubble ${className}`}>
          {`${data.sender_email}: ${data.message}`}
        </div>
      );
      setChatMessages((prevMessages) => [...prevMessages, messageElem]);
    };
    setSocket(newSocket);
  };

  const sendMessage = () => {
    if (messageInput && socket && socket.readyState === WebSocket.OPEN) {
      const messagePayload = {
        sender_email: userId,
        message: messageInput,
        shop_user_email: sellerId,
        visitor_user_email: userId,
      };

      socket.send(JSON.stringify(messagePayload));
      setMessageInput("");
    }
  };

  return (
    <div className="chatting">
      <Header />
      <div id="chat-container">

        {/* <!-- 채팅방 메시지 --> */}
        <div id="chat-messages">{chatMessages}
        <div ref={messagesEndRef} /></div>

        {/* <!-- 메시지 입력 및 전송 --> */}
        <input
          type="text"
          value={messageInput}
          onChange={handleInputChange}
          placeholder="메시지를 입력하세요"
        />
        <button id="send-btn" onClick={sendMessage}>
          보내기
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
