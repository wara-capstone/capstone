import { Container, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import ClothFeedListItem from "./ClothFeedListItem";

function ClothFeedList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://101.101.216.115:21000/api/user-feed`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
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
      <Container sx={{ paddingBottom: '70px', paddingTop: '10px' }}>
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item xs={6} sm={6} key={post.id}>
              <ClothFeedListItem
                id={post.id}
                userFeedImage={post.userFeedImage}
                userImage={post.user.userImage}
                userName={post.user.userName}
                createdAt={post.createdAt}
                modifiedAt={post.modifiedAt}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default ClothFeedList;
