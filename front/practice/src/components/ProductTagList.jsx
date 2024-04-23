import React from "react";
import { faker } from '@faker-js/faker';
import {useEffect, useState} from 'react';
import { Grid } from '@mui/material';
import ProductTagListItem from './ProductTagListItem';


function ProductTagList(){
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

    // 클릭 이벤트 핸들러 함수
    const handleItemClick = (post) => {
        console.log("Selected Item:", post);
        // 여기에서 클릭된 아이템 처리 로직을 구현하세요.
    };



    return(
        <Grid container spacing={2}> {/* 컨테이너 설정, 카드 사이의 간격은 2로 설정 */}
            {posts.map((post) => (
                <Grid item xs={12} sm={6} key={post.id}> {/* 반응형으로 설정: 작은 화면에서는 한 줄에 하나, 중간 크기 화면에서는 한 줄에 두 개 */}
                    <ProductTagListItem 
                        id={post.id}
                        userName={post.userName}
                        userImg={post.userImg}
                        img={post.img}
                        caption={post.caption}

                        {...post} // 모든 post 프로퍼티를 ProductTagListItem에 전달
                        onClick={() => handleItemClick(post)} // 클릭 이벤트 핸들러를 ProductTagListItem에 전달
                    />
                </Grid>
            ))}
        </Grid>

    );


}


export default ProductTagList;