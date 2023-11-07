// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import BottomNav from "../components/BottomNav";
// import Header from "../components/Header";

// export default function ChattingList() {
//   const [visitorUserEmails, setVisitorUserEmails] = useState([]);
//   const userId = sessionStorage.getItem("email"); // 실제 userId 값으로 대체

//   // 서버에서 채팅 목록을 불러오는 기능 추가
//   useEffect(() => {
//     async function fetchChattingList() {
//       try {
//         const response = await fetch(
//           `http://3.34.227.3:14000/chat/rooms/?email=${userId}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         // const userEmails = data.map((room) => room.visitor_user_email);
//         const userRoomInfo = data.map((room) => ({
//           email: room.visitor_user_email,
//           latestMessage: room.latest_message,
//         }));
//         setVisitorUserEmails(userRoomInfo);
//       } catch (error) {
//         console.error("Error getting visitor_user_emails:", error);
//       }
//     }

//     fetchChattingList();
//   }, [userId]);

//   return (
//     <div className="chatting-list">
//       <Header />
//       <h1>Chatting List</h1>
//       <ul>
//         {visitorUserEmails.map((user, index) => (
//           <li key={index}>
//             <Link to={`/chatting/1`}>{user.email}</Link>
//             <div>Latest Message: {user.latestMessage}</div>
//           </li>
//         ))}
//       </ul>
//       <BottomNav />
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";

export default function ChattingList() {
  const [visitorUserEmails, setVisitorUserEmails] = useState([]);
  const userId = sessionStorage.getItem("email"); // 실제 userId 값으로 대체

  const roundImage = "https://via.placeholder.com/150x150";

  // 서버에서 채팅 목록을 불러오는 기능 추가
  useEffect(() => {
    async function fetchChattingList() {
      try {
        const response = await fetch(
          `http://3.34.227.3:14000/chat/rooms/?email=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const userRoomInfo = data.map((room) => ({
          email: room.shop_user_email,
          latestMessage: room.latest_message,
        }));
        setVisitorUserEmails(userRoomInfo);
      } catch (error) {
        console.error("Error getting visitor_user_emails:", error);
      }
    }

    fetchChattingList();
  }, [userId]);

  return (
    <div className="chatting-list">
      <Header />
      <div className="chatting-list-container">
        <div className="chatting-lists">
          {visitorUserEmails.map((user, index) => (
            <div key={index} className="list-item">
              <Link to={`/chatting/1`}>
                <div className="list-item-content">
                  <img src={roundImage} alt="User" className="round-image" />
                  <div className="user-details">
                    <h2>{user.email}</h2>
                    <p>최근 메세지: {user.latestMessage}</p>
                  </div>
                </div>
              </Link>
              <div className="card-separator"></div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
