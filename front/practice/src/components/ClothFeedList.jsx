import { Container, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRefreshToken } from "../utils/authUtil";
import ClothFeedListItem from "./ClothFeedListItem";

function ClothFeedList() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const RefreshToken = localStorage.getItem("RefreshToken");

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

      if (response.status === 401) {
        RefreshToken = localStorage.getItem("RefreshToken");
        fetchRefreshToken(RefreshToken);
        token = localStorage.getItem("token");
      }

      if (response.status === 200) {
        const data = await response.json(); // response.json()이 완료될 때까지 기다림

        setPosts(data); // 상태 업데이트
        console.log("서버로 받은");
        console.log(data);
      } else {
        console.log("실패");
      }
    };
    fetchData();
  }, [token]);

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
      <Container sx={{ paddingBottom: "70px", paddingTop: "10px"}}>
        {" "}
        <Grid container spacing={1}>
          {" "}
          {posts.map((post) => (
            <Grid item xs={9} sm={6} key={post.id}>
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
    </div>
  );
}

export default ClothFeedList;
