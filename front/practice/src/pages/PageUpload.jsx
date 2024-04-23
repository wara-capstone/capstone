import React, { useState } from 'react';
import { Button, Box }from '@mui/material';
//import ProductTagListItem from '../components/ProductTagListItem';
import ProductImageWithTags from '../components/ProductImageWithTags';
import ProductTagList from '../components/ProductTagList';


function PageUpload() {
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    //const [showTags, setShowTags] = useState(false); // 상품태그를 표시할지 여부를 결정하는 state
    const [showProductList, setShowProductList] = useState(false); // 상품 목록을 표시할지 여부를 결정하는 상태
    const [openModal, setOpenModal] = useState(false); // 모달 상태 관리

    const handleImageChange = (e) => {
      e.preventDefault();
  
      let reader = new FileReader();
      let file = e.target.files[0];
  
      if (file) {
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result);
          //setShowTags(false); // 이미지가 새로 업로드될 때 태그 표시를 초기화
        }
  
        reader.readAsDataURL(file);
      }
    };
  
    const handleAddTagClick = () => {
        //setShowTags(true); // 상품태그 추가 버튼 클릭 시 상품태그를 표시합니다.
        setShowProductList(true);
    };

    const handleOpenModal = () => {
      setOpenModal(true); // 모달 열기
    };
  
    const handleCloseModal = () => {
      setOpenModal(false); // 모달 닫기
    };

    return (
        <div className='PageUpload'>
      {!imagePreviewUrl && (
        <div>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="contained-button-file"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" component="span">
              사진 업로드
            </Button>
          </label>
        </div>
      )}
      
      {/* 이미지 미리보기 박스를 ProductImageWithTags 컴포넌트로 변경합니다. */}
      {imagePreviewUrl  && (
        <ProductImageWithTags imageUrl={imagePreviewUrl} />
      )}
      {imagePreviewUrl  && (
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
          <img src={imagePreviewUrl} alt="Preview" style={{ width: '100%', height: 'auto' }} />
        </Box>
        
      )}
      {/* 이미지 업로드 후 보이는 버튼 */}
      {imagePreviewUrl && (
  <div>
    <Button 
      variant="contained" 
      onClick={handleAddTagClick} // 상품태그 추가 버튼 클릭 이벤트 핸들러
      style={{ 
          marginBottom: 20, 
          backgroundColor: 'white', // 버튼 배경색을 하얀색으로 설정
          color: 'black', // 버튼 글씨색을 검정색으로 설정
          border: '1px solid #ccc', // 테두리를 회색으로 설정
          padding: '10px 100px', // 버튼의 내부 여백을 조정하여 길쭉한 형태로 만듦
      }}>
      상품태그 추가
    </Button>
    {/* 여기에 ProductTagListItem 컴포넌트 추가 */}
    {showProductList && <ProductTagList />}
    
    </div>
    )}
    </div>
  );
}
  

export default PageUpload;