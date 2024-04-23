import React, { useState } from 'react';
import { Button, Box, Dialog, DialogTitle, DialogContent }from '@mui/material';
//import ProductTagListItem from '../components/ProductTagListItem';
import ProductImageWithTags from '../components/ProductImageWithTags';
import ProductTagList from '../components/ProductTagList';


function PageUpload() {
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    //const [showTags, setShowTags] = useState(false); // 상품태그를 표시할지 여부를 결정하는 state
    const [openModal, setOpenModal] = useState(false); // 모달 상태 관리
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [tagPosition, setTagPosition] = useState(null);


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

    const handleOpenModal = () => {
      setOpenModal(true); // 모달 열기
    };
  
    const handleCloseModal = () => {
      setOpenModal(false); // 모달 닫기
    };

    const handleProductSelect = (product) => {
      setSelectedProduct(product);
      handleCloseModal();
    };
  
    const handleImageClick = (e) => {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element.
      const y = e.clientY - rect.top;  // y position within the element.
      setTagPosition({ x, y });
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
      
      
      {/* 이미지 업로드 후 보이는 버튼 */}
      {imagePreviewUrl && (
  <>
  <Button style={{border: '1px solid #ccc', position: 'relative', top: 10, left: 100  }}>
    등록
  </Button>
  <ProductImageWithTags imageUrl={imagePreviewUrl} onImageClick={handleImageClick} selectedProduct={selectedProduct} tagPosition={tagPosition} />
    <Button 
      variant="outlined" 
      onClick={handleOpenModal} // 상품태그 추가 버튼 클릭 이벤트 핸들러
      style={{ 
          marginBottom: 20, 
          backgroundColor: 'white', // 버튼 배경색을 하얀색으로 설정
          color: 'black', // 버튼 글씨색을 검정색으로 설정
          border: '1px solid #ccc', // 테두리를 회색으로 설정
          padding: '10px 100px', // 버튼의 내부 여백을 조정하여 길쭉한 형태로 만듦
      }}>
      상품태그 추가
    </Button>
      {/* 선택된 상품 태그 정보 표시 */}
      {selectedProduct && (
                        <Box style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', backgroundColor: '#f0f0f0' }}>
                            <p>선택된 상품: {selectedProduct.name}</p>
                            {/* 필요한 경우 추가적인 상품 정보 표시 */}
                        </Box>
                    )}
                </>
      )}
    <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>상품 선택</DialogTitle>
                <DialogContent>
                    <ProductTagList onProductSelect={handleProductSelect} />
                </DialogContent>
            </Dialog>
        </div>
  );
}
  

export default PageUpload;