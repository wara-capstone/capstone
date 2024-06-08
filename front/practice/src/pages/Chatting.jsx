import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { fetchRefreshToken } from "../utils/authUtil";

export default function Chatting() {
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [userNames, setUserNames] = useState({});
  const CHATTING_URL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_DJANGO_CHATTING_URL
      : process.env.REACT_APP_API_URL;
  const location = useLocation(); // 채팅방으로 넘어온 값

  // location.state.seller를 통해 storeData.storeSeller 값 받아옴
  const seller = location.state.seller;

  const userId = localStorage.getItem("email"); // 실제 userId 값으로 대체
  let token = localStorage.getItem("token"); // 실제 token 값으로 대체
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

  const getUserName = async (email) => {
    const response = await fetch(
      `${process.env.NODE_ENV === "development" ? "" : ""}${
        process.env.REACT_APP_API_URL
      }user?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    const result = await response.json();
    if (response.status === 200) {
      return result.nickname;
    } else {
      console.log("실패");
      return email;
    }
  };

  const openOrCreateRoom = async (tryAgain = true) => {
    if (socket) {
      socket.close();
    }

    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === "development" ? "" : ""
        }${CHATTING_URL}chat/rooms/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            shop_user_email: sellerId,
            visitor_user_email: userId,
          }),
        }
      );

      if (response.status === 401 && tryAgain) {
        const refreshToken = localStorage.getItem("RefreshToken");
        await fetchRefreshToken(refreshToken); // fetchRefreshToken이 프로미스를 반환하고, 새로운 토큰을 localStorage에 저장한다고 가정
        token = localStorage.getItem("token"); // 새로운 토큰으로 업데이트
        return openOrCreateRoom(false); // 재귀 호출하지만, 무한 루프 방지를 위해 tryAgain을 false로 설정
      }

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

  const displayMessages = async (messages) => {
    // 메시지를 시간 순서대로 정렬
    messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const messageElements = await Promise.all(
      messages.map(async (message) => {
        const userName = await getUserName(message.sender_email);
        const className = message.sender_email === userId ? "sent" : "received";
        return (
          <div key={message.id} className={`message-bubble ${className}`}>
            {`${userName}: ${message.text}`}
          </div>
        );
      })
    );
    setChatMessages(messageElements);
  };

  const setupWebSocket = (roomId, authToken) => {
    // 인증 토큰을 URL의 쿼리 파라미터로 추가
    const newSocket = new WebSocket(
      `${
        process.env.NODE_ENV === "development"
          ? "ws://"
          : "wss://www.onoff.zone"
      }${CHATTING_URL}ws/room/${roomId}/messages?token=${authToken}`
    );

    newSocket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      const userName = await getUserName(data.sender_email);

      const className = data.sender_email === userId ? "sent" : "received";
      const messageElem = (
        <div key={data.id} className={`message-bubble ${className}`}>
          {`${userName}: ${data.message}`}
        </div>
      );

      setChatMessages((prevMessages) => {
        const newMessages = [...prevMessages, messageElem];
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
        <div id="chat-messages">
          {chatMessages}
          <div ref={chatMessagesRef} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <div id="message-input-container">
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
          </div>
        </form>
      </div>
      <BottomNav />
    </div>
  );
}
