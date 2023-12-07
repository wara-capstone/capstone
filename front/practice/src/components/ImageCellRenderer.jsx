import React from 'react';

const ImageCellRenderer = (props) => (
  <img src={props.value[0]} style={{ width: '60px', height: 'auto', justifyContent: 'center', alignItems: 'center'}} alt="Product" />
);

export default ImageCellRenderer;