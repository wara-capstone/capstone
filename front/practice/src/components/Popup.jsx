import React, { useState } from 'react';

const Popup = ({ handleClose, show }) => {
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');

  const handleSubmit = () => {
    // 선택한 색상과 크기를 처리하는 로직을 여기에 작성하세요.
    console.log(`Color: ${color}, Size: ${size}`);
    handleClose();
  };

  return (
    <div className={show ? 'popup display-block' : 'popup display-none'}>
      <section className='popup-main'>
        <button onClick={handleClose}>닫기</button>
        <h2>상품 옵션 선택</h2>
        <label>
          색상:
          <select onChange={(e) => setColor(e.target.value)}>
            <option value=''>--색상을 선택하세요--</option>
            <option value='red'>빨강</option>
            <option value='blue'>파랑</option>
            <option value='green'>초록</option>
            {/* 필요한 만큼 추가하세요 */}
          </select>
        </label>
        <label>
          크기:
          <select onChange={(e) => setSize(e.target.value)}>
            <option value=''>--크기를 선택하세요--</option>
            <option value='small'>소</option>
            <option value='medium'>중</option>
            <option value='large'>대</option>
            {/* 필요한 만큼 추가하세요 */}
          </select>
        </label>
        <button onClick={handleSubmit}>확인</button>
      </section>
    </div>
  );
};

export default Popup;