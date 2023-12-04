import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";

export default function Chatting() {
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const location = useLocation(); // 채팅방으로 넘어온 값

  // location.state.seller를 통해 storeData.storeSeller 값 받아옴
  const seller = location.state.seller;

  const userId = localStorage.getItem("email"); // 실제 userId 값으로 대체
  const token = localStorage.getItem("token"); // 실제 token 값으로 대체
  var sellerId = seller;

  const chatMessagesRef = useRef(null); // Ref를 생성

  const scrollToBottom = () => {
    //스크롤 내리는 함수
    chatMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    openOrCreateRoom();
  }, []);

  useEffect(() => {
    // 메시지 배열이 변경될 때마다 스크롤을 최하단으로 이동
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    // 컴포넌트가 언마운트될 때 웹소켓 연결 종료
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const openOrCreateRoom = async () => {
    if (socket) {
      socket.close();
    }

    try {
      const response = await fetch("/api/chat/rooms/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
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

      setCurrentRoomId(roomData.id);
      displayMessages(roomData.messages);
      setupWebSocket(roomData.id, token);
    } catch (error) {
      console.error(error);
    }
  };

  const displayMessages = (messages) => {
    console.log("h1");

    // 메시지를 시간 순서대로 정렬
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const messageElements = messages.map((message) => {
      // if (message.sender_email && message.text) {
      const className = message.sender_email === userId ? "sent" : "received";
      return (
        <div
          key={message.id} // 각 메시지에 고유한 key prop를 제공합니다.
          className={`message-bubble ${className}`}
        >
          {`${message.sender_email}: ${message.text}`}
        </div>
      );
      // }
      // return null;
    });
    setChatMessages(messageElements);
  };

  const setupWebSocket = (roomId, authToken) => {
    // 인증 토큰을 URL의 쿼리 파라미터로 추가
    const newSocket = new WebSocket(
      `/api/ws/room/${roomId}/messages?token=${authToken}`
    );

    console.log(newSocket.url);

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const className = data.sender_email === userId ? "sent" : "received";
      const messageElem = (
        <div key={data.id} className={`message-bubble ${className}`}>
          {`${data.sender_email}: ${data.message}`}
        </div>
      );
      // setChatMessages((prevMessages) => [...prevMessages, messageElem]);
      setChatMessages((prevMessages) => {
        // 새로운 메시지를 메시지 배열의 끝에 추가
        const newMessages = [...prevMessages, messageElem];

        // 메시지 배열을 timestamp에 따라 정렬
        newMessages.sort((a, b) => new Date(a.key) - new Date(b.key));

        return newMessages;
      });
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
        <div id="chat-messages">
          {chatMessages}
          <div ref={chatMessagesRef} />
        </div>
        {/* <!-- 메시지 입력 및 전송 --> */}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            id="message-input"
            type="text"
            value={messageInput}
            onChange={handleInputChange}
            placeholder="메시지를 입력하세요"
          />
          <button id="send-btn" onClick={sendMessage}>
            보내기
          </button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
}
