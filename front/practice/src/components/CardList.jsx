import React from "react";
import { Link } from "react-router-dom";
import Data from "../DB/Data.json";
import Card from "./Card"; // Card 컴포넌트 임포트
import "./Card.css";
// import { useEffect, useState } from "react";

function CardList() {
  var cardList; // 검색 결과를 저장할 변수

  // useEffect(() => {

  //     fetch('https://port-0-creativefusion-jvpb2aln5qmjmz.sel5.cloudtype.app/store', {
  //         method: 'GET',
  //         headers: {
  //             "Authorization": `${token}`
  //         }
  //     })
  //         .then(response => {
  //             if (response.ok) {
  //                 return response.json(); // JSON 형식의 응답을 파싱
  //             }
  //             throw new Error('네트워크 응답이 실패했습니다.');
  //         })
  //         .then(data => {
  //             console.log(data);
  //             setName(data.name);
  //             setContent(data.content);
  //             setPreviewImageSrc(data.images[0].image);
  //         })
  //         .catch(error => {
  //             console.log(error);
  //         })
  // }, []);

  return (
    <div className="card-list">
      {Data.cardData.map((card) => (
        <Link to={`/item/${card.id}`} key={card.id} className="card-link">
          <Card
            key={card.id}
            title={card.title}
            subTitle={card.subTitle}
            content={card.content}
            mainImage={card.images[0].image}
            content2={card.content2}
          />
        </Link>
      ))}
    </div>
  );
}

export default CardList;
