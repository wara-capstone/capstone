import React, { useEffect, useRef, useState } from "react";
import SellerHeader from "./SellerHeader";

export default function SellerChattingManagement() {
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  const userId = sessionStorage.getItem("email");
  const token = sessionStorage.getItem("token"); // 실제 token 값으로 대체

  const [roundImage, setRoundImage] = useState(
    "https://via.placeholder.com/150x150"
  );
  const chatMessagesRef = useRef(null); // Ref를 생성

  const scrollToBottom = () => {
    //스크롤 내리는 함수
    chatMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]); // 메시지가 추가될 때마다 스크롤 내리기

  useEffect(scrollToBottom, [chatMessages]); // 메시지가 추가될 때마다 스크롤 내리기

  useEffect(() => {
    if (customerId) {
      openOrCreateRoom();
    }
  }, [customerId]);

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleCustomerIdChange = (value) => {
    setCustomerId(value);
  };

  const openOrCreateRoom = async () => {
    if (socket && socket.readyState !== WebSocket.CLOSED) {
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
          shop_user_email: userId,
          visitor_user_email: customerId,
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
      `wss://www.onoff.zone/api/ws/room/${roomId}/messages`
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
    if (messageInput) {
      const messagePayload = {
        sender_email: userId,
        message: messageInput,
        shop_user_email: userId,
        visitor_user_email: customerId,
      };

      socket.send(JSON.stringify(messagePayload));
      setMessageInput("");
    }
  };

  const [visitorUserEmails, setVisitorUserEmails] = useState([]);

  // 서버에서 채팅 목록을 불러오는 기능 추가
  useEffect(() => {
    async function fetchChattingList() {
      try {
        const response = await fetch(`/api/chat/rooms/?email=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const userRoomInfoPromises = data.map(async (room) => {
          const image = await fetchImage(room.visitor_user_email);
          return {
            email: room.visitor_user_email,
            latestMessage: room.latest_message,
            image: image,
          };
        });

        const userRoomInfo = await Promise.all(userRoomInfoPromises);
        setVisitorUserEmails(userRoomInfo);
      } catch (error) {
        console.error("Error getting visitor_user_emails:", error);
      }
    }
    fetchChattingList();
  }, [userId]);

  const fetchImage = async (email) => {
    const response = await fetch(`/api/user?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (response.status === 200) {
      setRoundImage(result.profileImage); // 상태 업데이트
      console.log("성공");
      console.log(result.email);
      console.log(result.profileImage);
      return result.profileImage;
    } else {
      console.log("실패");
    }
  };

  return (
    <div className="seller-chatting-management">
      <SellerHeader />
      <div className="seller-chatting-management-container">
        <div className="chatting-list-container">
          <div className="chatting-lists">
            {visitorUserEmails.map((user, index) => (
              <div
                key={index}
                className="list-item"
                onClick={() => handleCustomerIdChange(user.email)}
              >
                <div className="list-item-content">
                  <img src={user.image} alt="User" className="round-image" />
                  <div className="user-details">
                    <h2>{user.email}</h2>
                    <p>최근 메세지: {user.latestMessage}</p>
                  </div>
                </div>
                <div className="card-separator"></div>
              </div>
            ))}
          </div>
        </div>

        <div id="chat-container" className="seller-chat-container">
          {/* <!-- 채팅방 메시지 --> */}
          <div id="chat-messages">
            {chatMessages}
            <div ref={chatMessagesRef} />
          </div>

          {/* <!-- 메시지 입력 및 전송 --> */}
          <input
            type="text"
            value={messageInput}
            onChange={handleInputChange}
            placeholder="메시지를 입력하세요"
            id="message-input"
          />
          <button id="send-btn" onClick={sendMessage}>
            보내기
          </button>
        </div>
      </div>
    </div>
  );
}
