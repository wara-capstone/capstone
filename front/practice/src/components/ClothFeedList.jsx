import React from "react";
import { faker } from '@faker-js/faker';
import {useEffect, useState} from 'react';
import { Grid } from '@mui/material';
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

return(
    <Grid container spacing={2}> {/* 컨테이너 설정, 카드 사이의 간격은 2로 설정 */}
            {posts.map((post) => (
                <Grid item xs={12} sm={6} key={post.id}> {/* 반응형으로 설정: 작은 화면에서는 한 줄에 하나, 중간 크기 화면에서는 한 줄에 두 개 */}
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
);
}

export default ClothFeedList;