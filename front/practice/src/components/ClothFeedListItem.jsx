import React from "react";
import styled from "styled-components";
import CarMedia from '@mui/material/CarMedia';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const Wrapper = styled.div`
    width: calc(100%-32px);
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border: 1px solid grey;
    border-radius: 8px;
    cursor: pointer;
    background: white;
    :hover {
        background: lightgrey;
        }
    `;

const TitleImage = styled.p`
        <CarMedia component ="img" image={img} alt={caption} />
    `;

function ClothFeedListItem(props, {Id, userName, userImg, caption}){
    const { post, onClick} = props;
        
    return(
        <Wrapper onClick={onClick}>
            {/* <TitleImage>{post.image}</TitleImage> */}
            <CarMedia component ="img"  />
            <CardHeader 
                avatar={
                    <Avatar src={userImg} aria-label={userName}>
                        {userName.charAt(0)}
                    </Avatar>
                }
                action
            />
            title={<Typography fontWeight="bold">{userName}</Typography>}

        </Wrapper>
            

    );
}

export default ClothFeedListItem;