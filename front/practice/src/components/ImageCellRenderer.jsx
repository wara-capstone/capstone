import React from 'react';

const ImageCellRenderer = (props) => (
  <img src={props.value[0]} style={{ width: '50px', height: 'auto' }} alt="Product" />
);

export default ImageCellRenderer;