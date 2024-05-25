import React from "react";
import {useEffect, useState} from 'react';
import { Grid } from '@mui/material';
import ProductTagListItem from './ProductTagListItem';


function ProductTagList({ posts, handleItemClick}){
    // const [posts, setPosts] = useState([]);

    // //  useEffect(() => {

    // //    const fetchPosts = async () => {
    // //      try {
    // //        // API 요청을 보낸다고 가정, 여기서 'https://example.com/api/posts'는 예시 URL입니다.
    // //        // 실제 요청할 서버의 URL로 교체해주세요.
    // //        const response = await fetch("https://example.com/api/posts");
    // //        if (!response.ok) {
    // //          throw new Error("Something went wrong");
    // //        }
    // //        const data = await response.json(); // 응답 데이터를 JSON 형식으로 파싱
    // //        setPosts(data); // 상태 업데이트
    // //      } catch (error) {
    // //        console.error("Failed to fetch posts:", error);
    // //      }
    // //    };

    // //    fetchPosts(); // 데이터를 가져오는 함수 호출
    // //  }, []);

    // // 클릭 이벤트 핸들러 함수
    // const handleItemClick = (post) => {
    //     console.log("Selected Item:", post);
    //     // 여기에서 클릭된 아이템 처리 로직을 구현하세요.
    // };

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