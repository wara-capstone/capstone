import React from "react";
import styled from "styled-components";
import ClothFeedListItem from "./ClothFeedListItem";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    :not(:last-child) {
        margin-bottom: 16px;
    }
`;

function ClothFeedList(props){
    const {posts, onClickItem } = props;

    return (
        <Wrapper>
            {posts.map((post, index) => {
                return (
                    <ClothFeedListItem
                        key={post.id}
                        post={post}
                        onClick={() => {
                            onClickItem(post);
                        }}
                    />
                );
            })}
        </Wrapper>

    );
}

export default ClothFeedList;