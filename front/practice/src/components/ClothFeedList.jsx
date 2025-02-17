// import { Container, Grid } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import ClothFeedListItem from "./ClothFeedListItem";

// function ClothFeedList() {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await fetch(`http://101.101.216.115:21000/api/user-feed`);
//         const data = await response.json();
//         setPosts(data);
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//       }
//     };

//     fetchPosts();
//   }, []);

//   return (
//     <div
//       className="ClothFeedList"
//       style={{
//         backgroundColor: "white",
//         // position: "relative",
//         // padding: "10px",
//         // bottom: "20px",
//       }}
//     >
//       <Container sx={{ paddingBottom: '70px', paddingTop: '10px' }}>
//         <Grid container spacing={2}>
//           {posts.map((post) => (
//             <Grid item xs={6} sm={6} key={post.id}>
//               <ClothFeedListItem
//                 id={post.id}
//                 userFeedImage={post.userFeedImage}
//                 userImage={post.user.userImage}
//                 userName={post.user.userName}
//                 createdAt={post.createdAt}
//                 modifiedAt={post.modifiedAt}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </div>
//   );
// }

// export default ClothFeedList;

import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Grid } from "@mui/material";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClothFeedListItem from "./ClothFeedListItem";

function ClothFeedList() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  // const RefreshToken = localStorage.getItem("RefreshToken");
  const isLogin = localStorage.getItem("token") ? true : false;

  const navigate = useNavigate();

  const handleFeedUpload = () => {
    // 페이지 이동
    navigate("/user/pageUpload");
  };

  const url = `${process.env.NODE_ENV === "development" ? "" : ""}${
    process.env.REACT_APP_API_URL
  }user-feed`;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json(); // response.json()이 완료될 때까지 기다림

        setPosts(data); // 상태 업데이트
        console.log("서버로 받은");
        console.log(data);
      } else {
        message.error("피드를 불러오는데 실패했습니다.");
        console.log("실패");
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className="ClothFeedList"
      style={{
        backgroundColor: "#f2f2f2",

        // height: "88vh",
        // position: "relative",
        // padding: "10px",
        // bottom: "20px",
      }}
    >
      <Container sx={{ paddingBottom: "70px", paddingTop: "10px" }}>
        {" "}
        <Grid container spacing={1}>
          {" "}
          {posts.map((post) => (
            <Grid item xs={6} sm={12} key={post.id}>
              {" "}
              <Link
                to={`/ViewClothSharedFeed/${post.id}`}
                key={post.id}
                className="card-link"
              >
                <ClothFeedListItem
                  id={post.id}
                  userFeedContent={post.userFeedContent}
                  userName={post.user.userName}
                  userImg={post.user.userImage}
                  img={post.userFeedImage}
                  caption={"와랄라"}
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>

      <div className="feed-upload-btn-container">
        {isLogin && (
          <button className="feed-upload-btn" onClick={handleFeedUpload}>
            <FontAwesomeIcon icon={faCirclePlus} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ClothFeedList;
