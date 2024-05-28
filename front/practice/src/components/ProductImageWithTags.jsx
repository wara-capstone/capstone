import React, { useState, useEffect } from 'react';
import './ProductImageWithTags.css';
import { Box, Grid }from '@mui/material';
import ProductTagListItem from './ProductTagListItem';
function ProductImageWithTags({ imageUrl, onImageClick, selectedProduct }) {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    console.log("상품태그 업데이트되었습니다.");
    console.log(tags);
  }, [tags]);

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
      >
      <img src={imageUrl} alt="Product" style={{ width: '100%' }} />
    </Box>
    {tags.map(tag => (
      <div
        key={tag.id}
        className="product-tag"
        style={{
          position: 'absolute',
          left: tag.x,
          top: tag.y,
          transform: 'translate(-50%, -50%)', // 태그를 클릭한 위치에 중앙에 배치
        }}
      >
        
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}> {/* 그리드 아이템의 크기 조정 */}
              <ProductTagListItem
                itemData={tag.product}
                onClick={() => onImageClick(tag.product)}
               
              />
            </Grid>
      </div>
    ))}
  </div>
);
}

export default ProductImageWithTags;
