import React from 'react';

const ImageCellRenderer = (props) => (
  <img src={props.value[0]} style={{ width: '60px'}} alt="Product" />
);

export default ImageCellRenderer;