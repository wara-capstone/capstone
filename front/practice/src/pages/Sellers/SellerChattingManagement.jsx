import React, { useEffect, useState } from "react";
import SellerHeader from "./SellerHeader";

export default function SellerChattingManagement() {
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const userId = sessionStorage.getItem("email");
  var customerId = "user@naver.com";

  useEffect(() => {
    openOrCreateRoom(userId);
  }, []);

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  // const loginAsUser = async (email) => {
  //   setCurrentUserEmail(email);
  //   setVisitorUserEmail(
  //     email === "qw@naver.com" ? "er@naver.com" : "qw@naver.com"
  //   );
  //   await openOrCreateRoom();
  // };

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
          shop_user_email: customerId,
          visitor_user_email: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const roomData = await response.json();
      setCurrentRoomId(roomData.id);
      displayMessages(roomData.messages);
      setupWebSocket(roomData.id);
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
    if (messageInput) {
      const messagePayload = {
        sender_email: userId,
        message: messageInput,
        shop_user_email: customerId,
        visitor_user_email: userId,
      };

      socket.send(JSON.stringify(messagePayload));
      setMessageInput("");
    }
  };

  return (
    <div className="seller-chatting-management">
      <SellerHeader />
      <div id="chat-container">
        {/* <!-- 로그인 버튼 --> */}
        {/* <button onClick={() => loginAsUser("qw@naver.com")}>
          User 1 (qw@naver.com)
        </button>
        <button onClick={() => loginAsUser("er@naver.com")}>
          User 2 (er@naver.com)
        </button> */}

        {/* <button onClick={() => openOrCreateRoom(userId)}>
          User 1 (qw@naver.com)
        </button> */}

        {/* <!-- 채팅방 메시지 --> */}
        <div id="chat-messages">{chatMessages}</div>

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
  );
}
