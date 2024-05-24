import { faker } from "@faker-js/faker";
import { Container, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import ClothFeedListItem from "./ClothFeedListItem";

function ClothFeedList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const mockPosts = [...Array(20)].map((_, i) => ({
      userName: faker.person.fullName(),
      userImg: faker.image.avatar(),
      img: faker.image.url(),
      caption: faker.lorem.text(),
      id: i,
    }));

    setPosts(mockPosts);
  }, []);

  return (
    <div
      className="ClothFeedList"
      style={{
        backgroundColor: "white",
        // position: "relative",
        // padding: "10px",
        // bottom: "20px",
      }}
    >
      <Container sx={{ paddingBottom: "70px", paddingTop: "10px" }}>
        {" "}
        <Grid container spacing={2}>
          {" "}
          {posts.map((post) => (
            <Grid item xs={12} sm={6} key={post.id}>
              {" "}
              {/* 반응형으로 설정: 작은 화면에서는 한 줄에 하나, 중간 크기 화면에서는 한 줄에 두 개 */}
              <ClothFeedListItem
                id={post.id}
                userName={post.userName}
                userImg={post.userImg}
                img={post.img}
                caption={post.caption}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default ClothFeedList;
