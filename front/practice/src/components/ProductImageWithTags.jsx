import React, { useState, useEffect } from 'react';
import './ProductImageWithTags.css';
import { Box, Grid }from '@mui/material';
import Draggable from 'react-draggable';
import ProductTagListItem from './ProductTagListItem';
function ProductImageWithTags({ imageUrl, onImageClick, selectedProduct }) {
  const [tags, setTags] = useState([]);

  console.log("imageUrl는?", imageUrl);
  console.log("onImageClick는?", onImageClick);
  console.log("selectedProduct는?", selectedProduct);
  console.log("tags는?", tags);

  useEffect(() => {
    console.log("상품태그 업데이트되었습니다.");
    console.log(tags);
  }, [tags]);

  const handleTagPositionChange = (tag, position) => {
    if (position && typeof position.x === 'number' && typeof position.y === 'number') {
      const updatedTags = tags.map((t) =>
        t.id === tag.id ? { ...t, x: position.x, y: position.y } : t
      );
      setTags(updatedTags);
    } else {
      console.error('Invalid position object:', position);
    }
  };

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // 클릭된 위치의 X 좌표
    const y = e.clientY - rect.top; // 클릭된 위치의 Y 좌표

    // 새 태그를 태그 목록에 추가
    const newTag = { id: tags.length + 1, x: x, y: y, product: selectedProduct };
    setTags([...tags, newTag]);
  };

  return (
    <div className="image-container" onClick={handleImageClick}>
      <Box sx={{ position: 'relative', width: '100%', height: 'auto' }}>
        <img src={imageUrl} alt="Product" style={{ width: '100%' }} />
        {tags.map((tag) => (
          <Draggable
            key={tag.id}
            defaultPosition={{ x: tag.x, y: tag.y }}
            onDrag={(_, data) => handleTagPositionChange(tag, data.position)}
          >
            <div
              className="product-tag"
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <ProductTagListItem
                itemData={tag.product[0]}
                onClick={() => onImageClick(tag.product[0])}
              />
            </div>
          </Draggable>
        ))}
      </Box>
    </div>
  );
}

export default ProductImageWithTags;