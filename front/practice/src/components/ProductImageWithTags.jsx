import React, { useState } from 'react';
import './ProductImageWithTags.css';
import { Box }from '@mui/material';
function ProductImageWithTags({ imageUrl, onImageClick }) {
  const [tags, setTags] = useState([]);

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // 클릭된 위치의 X 좌표
    const y = e.clientY - rect.top; // 클릭된 위치의 Y 좌표

    // 새 태그를 태그 목록에 추가
    const newTag = { id: tags.length + 1, x: x, y: y };
    setTags([...tags, newTag]);
  };

  return (
    <div className="image-container" onClick={handleImageClick}>
      <Box
      sx={{
        width: 300, // 박스의 너비
        height: 300, // 박스의 높이
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        margin: 'auto' // 중앙 정렬
      }}
      onClick={onImageClick} // 이미지 클릭 이벤트 핸들러 추가
    >
      <img src={imageUrl} alt="Product" style={{ width: '100%' }} />
      </Box>
      {tags.map(tag => (
        <div key={tag.id} className="product-tag" style={{ left: tag.x, top: tag.y }}>
          태그 {tag.id}
        </div>
      ))}
    </div>
  );
}

export default ProductImageWithTags;
