import React from "react";
import styled from "styled-components";
import { faker } from '@faker-js/faker';
import {useEffect, useState} from 'react';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { PostConstruct } from "ag-grid-community";
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
    <div>
        {posts.map((post) => (
            <ClothFeedListItem 
                key={post.id}
                id={post.id}
                userName={post.userName}
                userImg={post.userImg}
                img={post.img}
                caption={post.caption}
            />
        ))}
    </div>
);
}

export default ClothFeedList;