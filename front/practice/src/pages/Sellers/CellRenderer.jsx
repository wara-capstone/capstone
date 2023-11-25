import React from 'react';
import { Link } from "react-router-dom";

export default function CellRenderer(props) {
  const cellValue = props.valueFormatted ? props.valueFormatted : props.value;

  return (
      <span>
          <span>{cellValue}</span>&nbsp;
          <Link to="/seller/item/management/select/:storeId/:productId">
              <button>수정</button>
          </Link>
      </span>
    );
  };
  