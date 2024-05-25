import { message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import SellerHeader from "./SellerHeader";

export default function SellerChattingManagement() {
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  const userId = localStorage.getItem("email");
  const token = localStorage.getItem("token"); // 실제 token 값으로 대체
  const CHATTING_URL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DJANGO_CHATTING_URL : process.env.REACT_APP_API_URL;
  const [roundImage, setRoundImage] = useState(
    "https://via.placeholder.com/150x150"
  );
  const chatMessagesRef = useRef(null); // Ref를 생성

  const scrollToBottom = () => {
    //스크롤 내리는 함수
    chatMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 메시지 배열이 변경될 때마다 스크롤을 최하단으로 이동
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1].props.children;

      setVisitorUserEmails((prevEmails) =>
        prevEmails.map((user) =>
          user.email === customerId
            ? { ...user, latestMessage: lastMessage }
            : user
        )
      );
    }
  }, [chatMessages]);

  useEffect(() => {
    if (customerId) {
      openOrCreateRoom();
    }
  }, [customerId]);

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

  const handleCustomerIdChange = (value) => {
    setCustomerId(value);
  };

  const openOrCreateRoom = async () => {
    if (socket) {
      socket.close();
    }

    try {
      const response = await fetch(`${process.env.NODE_ENV === 'development' ? '' : ''}${CHATTING_URL}chat/rooms/`, {
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

      setCurrentRoomId(roomData.id);
      displayMessages(roomData.messages);
      setupWebSocket(roomData.id, token);
    } catch (error) {
      console.error(error);
    }
  };

  const displayMessages = (messages) => {
    // 메시지를 시간 순서대로 정렬
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const messageElements = messages.map((message) => {
      // if (message.sender_email && message.text) {
      const className = message.sender_email === userId ? "sent" : "received";
      return (
        <div key={message.id} className={`message-bubble ${className}`}>
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
      `${process.env.NODE_ENV === 'development' ? 'ws://' : 'wss://www.onoff.zone'}${CHATTING_URL}ws/room/${roomId}/messages?token=${authToken}`
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
        shop_user_email: userId,
        visitor_user_email: customerId,
      };

      socket.send(JSON.stringify(messagePayload));
      setMessageInput("");
    }
  };

  const [visitorUserEmails, setVisitorUserEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  // 서버에서 채팅 목록을 불러오는 기능 추가
  useEffect(() => {
    async function fetchChattingList() {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NODE_ENV === 'development' ? '' : ''}${CHATTING_URL}chat/rooms/?email=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();

        // userId와 visitor_user_email이 다른 경우만 남깁니다.
        data = data.filter((room) => room.visitor_user_email !== userId);

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
        message.error("값을 불러오는데 실패하였습니다.");
      }
      setLoading(false);
    }
    fetchChattingList();
  }, [userId]);

  const fetchImage = async (email) => {
    const response = await fetch(`${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}user?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
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
  if (loading) {
    return <LoadingScreen></LoadingScreen>;
  } else {
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
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
            </form>
          </div>
        </div>
      </div>
    );
  }
}
