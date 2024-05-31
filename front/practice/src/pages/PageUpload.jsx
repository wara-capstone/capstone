import { Box, Button, Dialog, DialogContent, DialogTitle, Container } from "@mui/material";
import React, { useState, useEffect } from "react";
//import ProductTagListItem from '../components/ProductTagListItem';
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import ProductImageWithTags from "../components/ProductImageWithTags";
import ProductTagList from "../components/ProductTagList";
import { Grid } from '@mui/material';
import ProductTagListItem from "../components/ProductTagListItem";
import ProductSubmitButton from "../components/ProductSubmitButton";

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { fontSize } from "@mui/system";

function PageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  //const [showTags, setShowTags] = useState(false); // 상품태그를 표시할지 여부를 결정하는 state
  const [openModal, setOpenModal] = useState(false); // 모달 상태 관리
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tagPosition, setTagPosition] = useState(null);
  // const selectedProductsArray = [selectedProduct];
  const [selectedProductsArray, setSelectedProductsArray] = useState([]);
  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    if (file) {
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setImageFile(file);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setOpenModal(false); // 모달 닫기
  };

  useEffect(() => {
    console.log("상품선택한거표시표시표시");
    console.log(selectedProductsArray);
  }, [selectedProductsArray]);
  
  const handleProductSelect = (product) => {
    setSelectedProductsArray([...selectedProductsArray, product]);
    handleCloseModal();
  };

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top; // y position within the element.
    setTagPosition({ x, y });
  };

  return (
    
    <div className="PageUpload" >
      <Header />

      {!imagePreviewUrl && (
      <Container
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '500px',
          backgroundColor: 'white', // 컨테이너 색상을 흰색으로 설정
        }}
      >
        <div>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="contained-button-file"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              component="span"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: 'none', // 버튼 아웃라인 제거
                backgroundColor: 'white', // 버튼 배경색을 흰색으로 변경
                color: 'black', // 버튼 텍스트 색상을 검정색으로 변경
                boxShadow: 'none', // 버튼 그림자 제거
                borderRadius: '20px', // 버튼 라운드 추가
              }}
            >
              <AddPhotoAlternateIcon sx={{ fontSize: 100 ,border: 'none' }} />
            </Button>
          </label>
        </div>
      </Container>
    )}

      {/* 이미지 미리보기 박스를 ProductImageWithTags 컴포넌트로 변경합니다. */}

      {/* 이미지 업로드 후 보이는 버튼 */}
      {imagePreviewUrl && (
  <Box
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: '20px 0', // 위아래에 여백 추가
    }}
  >
    <Container
      style={{
        maxWidth: '800px', // 이미지 컨테이너의 최대 너비 설정
        display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      
      }}
    >
      <ProductImageWithTags
        imageUrl={imagePreviewUrl}
        onImageClick={handleImageClick}
        selectedProduct={selectedProduct}
        tagPosition={tagPosition}
      />
    </Container>
  </Box>
)}
       <Box
  style={{
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
  }}
>
  <Button
    variant="outlined"
    onClick={handleOpenModal}
    style={{
      backgroundColor: 'white',
      color: 'black',
      border: '1px solid black',
      borderRadius: '10px',
      padding: '10px 100px',
      fontWeight: 'bold',
    }}
  >
    상품태그 추가
  </Button>

  {selectedProductsArray.length > 0 && (
    <Grid container spacing={2}>
      {selectedProductsArray.map((product) => (
        <Grid item xs={12} sm={12} md={12}>
          <ProductTagListItem
            itemData={product}
            onClick={() => handleProductSelect(product)}
          />
        </Grid>
      ))}
    </Grid>
  )}

  <Grid item xs={12}>
    <ProductSubmitButton
      productData={selectedProductsArray}
      imageFile={imageFile}
    />
  </Grid>
</Box>
      
    
    <Dialog open={openModal} onClose={handleCloseModal}>
      <DialogTitle>상품 선택</DialogTitle>
      <DialogContent>
        <ProductTagList onProductSelect={handleProductSelect} />
      </DialogContent>
    </Dialog>
    <BottomNav />
  </div>
);
}

export default PageUpload;
