import React from "react";

// props 객체를 인자로 받아 구조 분해 할당을 통해 필요한 속성을 추출합니다.

import ClothFeedCard from './ClothFeedCard';

function ClothFeedListItem({ id, userName, userImg, img, caption, userFeedContent }) {
  console.log(userName); // 이제 userName은 문자열로 콘솔에 출력됩니다.
  console.log("userFeedContent를 불러 오고 있을까?", userFeedContent);

  return (
    <div className="ClothFeedListItem" >
      <ClothFeedCard
        userName={userName}
        userImg={userImg}
        img={img}
        caption={caption}
        userFeedContent={userFeedContent}
      />
    </div>
  );
}

export default ClothFeedListItem;