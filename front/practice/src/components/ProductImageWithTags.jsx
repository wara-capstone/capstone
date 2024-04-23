import React, { useState } from 'react';
import './ProductImageWithTags.css';

function ProductImageWithTags({ imageUrl }) {
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
      <img src={imageUrl} alt="Product" style={{ width: '100%' }} />
      {tags.map(tag => (
        <div key={tag.id} className="product-tag" style={{ left: tag.x, top: tag.y }}>
          태그 {tag.id}
        </div>
      ))}
    </div>
  );
}

export default ProductImageWithTags;
