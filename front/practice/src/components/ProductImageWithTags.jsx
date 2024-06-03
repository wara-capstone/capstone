import React, { useState, useEffect } from 'react';
import './ProductImageWithTags.css';
import { Box, Grid }from '@mui/material';
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
        {tags.map(tag => (
          <div key={tag.id}>
            {tag.product.map((product, index) => (
              <div
                key={`${tag.id}-${index}`}
                className="product-tag"
                style={{
                  position: 'absolute',
                  left: `${tag.x}px`,
                  top: `${tag.y + index * 50}px`, // 각 상품 태그를 Y축으로 구분
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <ProductTagListItem
                  itemData={product}
                  onClick={() => onImageClick(product)}
                />
              </div>
            ))}
          </div>
        ))}
      </Box>
    </div>
  );
}

export default ProductImageWithTags;