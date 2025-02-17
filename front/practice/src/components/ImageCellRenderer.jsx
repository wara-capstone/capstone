import React from 'react';

const ImageCellRenderer = (images) => {
  console.log("ㅠㅠ값이 들어있나?", images.data)

  if (!images.data || !images.data.productUrls || images.data.productUrls.length === 0) {
    return null; // 데이터가 없거나 productUrls가 없거나 비어있는 경우 렌더링하지 않음
  }

  const selectedIndex = 0; // 또는 2

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {images.data.productUrls[selectedIndex] && (
        <img
          src={images.data.productUrls[selectedIndex].url}
          alt={images.data.productUrls[selectedIndex].url}
          style={{
            height: '100px',
            margin: '10px',
            maxWidth: '100%',
            maxHeight: '100px',
            objectFit: 'contain',
          }}
        />
      )}
    </div>
  );
};

export default ImageCellRenderer;