import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

import { UploadOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";

import {PlusCircleOutlined, SaveOutlined, DeleteOutlined,BarcodeOutlined} from "@ant-design/icons";
import SellerHeader from "./SellerHeader";
import {Typography,Button,Form,Input,Select,Space,message} from "antd";
import "./Seller.css";
import ImageCellRenderer from "../../components/ImageCellRenderer";
import { fetchRefreshToken } from "../../utils/authUtil";

export default function SellerProductRegistration(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { storeId, productId } = useParams();
  const [optionIndex, setOptionIndex] = useState(0);

  const [mainCategory] = useState([
    "상의",
    "아우터",
    "하의",
    "신발",
    "잡화",
    "기타",
  ]);
  const [selectedCategory, setSelectedCategory] = useState(""); // 선택한 카테고리를 저장하는 상태 변수

  const handleMainCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  let token = localStorage.getItem("token");
  const [productInfo, setProductInfo] = useState({});
  //  const { productId } = props.location?.state || {};
  const [isTrue, setIsTrue] = useState();
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (images.url) {
      console.log("이미지가 담겼을까???ㅇㅇㅇ", images.url);
    }
  }, [images]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 단일 상품 조회 (+ 해당상품의 모든 옵션 조회)
        setLoading(true);
        const response = await axios.get(
          `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}product/all/${productId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        console.log("받아온 값(해당삼품의 모든 옵션 조회):" + JSON.stringify(response.data)); // 서버로부터 받아온 데이터를 JSON 문자열로 변환하여 출력
        console.log(JSON.stringify(response.data));
        if (response.status === 200) {
          setProductInfo(response.data);
          setImages(response.data.productUrls[0].url);
          setPreviewImage(response.data.productUrls[0].url); // 이미지 URL을 previewImage 상태에 저장
          // console.log("이미지가 담겼을까???ㅇㅇㅇ",images.url);
          setProductName(response.data.productName);
          setSelectedCategory(response.data.productCategory);
          setIsTrue(true);

          setOptionIndex(response.data.options.length);
          console.log("옵션이 존재??? ", response.data.options);
        } else if(response.status === 401){
            let RefreshToken = localStorage.getItem("RefreshToken");
            await fetchRefreshToken(RefreshToken);
            token = localStorage.getItem("token");
        }
        else {
          setProductInfo({ data: [] });
          setIsTrue(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // 서버로 보낼 변수들 이름 지정
  const [productName, setProductName] = useState(
    productInfo ? productInfo.productName : "");
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(false);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    setFile(file);
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmitButtonClick = async (tryAgain = true) => {
    try {
      var data = {
        productId: productId,
        storeId: storeId,
        productCategory: selectedCategory,
        productName: productName,
      };
      console.log("data :            " + data);
      const headers = {
        Authorization: `${token}`,
        // "content-type": "application/json",
      };

      let formData = new FormData();

      formData.append("productDTO", new Blob([JSON.stringify(data)], { type: "application/json" }))
      // images 추가
      if (file) {
        formData.append("images", file);
      }

      fetch(`${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}product/seller`,
        {
          method: "PUT",
          headers: headers,
          body: formData
        }

      ).then(async(response) => {
        if (response.status === 200) {
          message.success("저장되었습니다.");
        }
        else if(response.status === 401 && tryAgain){
          let RefreshToken = localStorage.getItem("RefreshToken");
          await fetchRefreshToken(RefreshToken);
          token = localStorage.getItem("token");  
          return handleSubmitButtonClick(false);
        }
        else {
          message.error("error");
        }
      });
      formData = new FormData();

      if (file) {
        console.log("file : ", file);
        formData.append("images", file);
        fetch(`${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}product/seller/product/` + productId,
          {
            method: "PUT",
            headers: headers,
            body: formData,
          }
        )
          .then((response) => {
            if (response.status === 200) {
              message.success("이미지 저장 완료");
              navigate("/seller/item/management/select/" + storeId);
              setFile(false);
            } else {
              message.error("error");
              console.log(response);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        navigate("/seller/item/management/select/" + storeId);
      }
    } catch (err) {
      message.error("잘못된 요청입니다.");
      console.log(err);
    }
  };

  const removeOption = async (index, tryAgain = true) => {
    try {
      // 1. 서버에 삭제 요청 보내기
      const response = await axios.delete(
        `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}product/seller/option/${
          productInfo.options[index].optionId
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Option deleted successfully");
      } 
      else if (response.status === 401 && tryAgain) {
        let RefreshToken = localStorage.getItem("RefreshToken");
        await fetchRefreshToken(RefreshToken);
        token = localStorage.getItem("token");
        return removeOption(index, false);
      }
      else {
        console.log("Failed to delete option:", response.status);
        
      }

      // 2. 상태 업데이트하기
      setProductInfo((prevProductInfo) => {
        const newOptions = [...prevProductInfo.options];
        newOptions.splice(index, 1);

        return {
          ...prevProductInfo,
          options: newOptions,
        };
      });
      message.error("삭제되었습니다.");
    } catch (error) {
      // 서버에서 오류 응답을 받았을 때 처리
      console.error("Failed to delete option:", error);
      message.error("새로운 옵션 등록에 실패하였습니다.");
    }
  };

  const barcodeDownload= async (index) => {
     // 이미지의 URL을 설정
     var imageUrl = `${productInfo.options[index].barcodeUrl}`;
      console.log(imageUrl);
     // 이미지 URL에 fetch 요청을 보냄
     fetch(imageUrl)
         // fetch의 응답을 Blob으로 변환
         .then(response => response.blob())
         // Blob 데이터를 처리
         .then(blob => {
             // Blob을 사용하여 새로운 URL을 생성
             var a = document.createElement('a'); // a 요소를 생성
             var url = window.URL.createObjectURL(blob); // Blob을 사용하여 URL 생성
             a.href = url; // a 요소의 href 속성에 생성한 URL 할당
             a.download = `${productName}_옵션${index+1}_barcode.png`; // 다운로드될 파일의 이름 설정

             // a 요소를 클릭하여 다운로드를 시작
             a.click();

             // 다운로드가 완료되면 URL.createObjectURL로 생성한 URL 해제
             window.URL.revokeObjectURL(url);
         })
         // 에러가 발생한 경우 처리
         .catch(error => {
             console.error('에러 발생:', error);
         });
  };

  let plusOption = () => {
    const newOption = {
      productPrice: "",
      productSize: "",
      productColor: "",
      productStock: "",
      productUrls: "",
    };

    setProductInfo((prevProductInfo) => {
      return {
        ...prevProductInfo,
        options: [...(prevProductInfo.options || []), newOption],
      };
    });
  };

  const handleInputChange = (index, field, value) => {
    // 이전 상태를 기반으로 새로운 options 배열 생성
    setProductInfo((prevProductInfo) => {
      // 새로운 요소를 추가하는 방식으로 기존 options 배열을 복사
      const newOptions = [...prevProductInfo.options];

      // 주어진 인덱스에 해당하는 옵션의 필드를 업데이트하거나, 새로운 요소를 추가
      if (newOptions[index]) {
        // 주어진 인덱스에 해당하는 옵션이 이미 존재하면 업데이트
        newOptions[index] = { ...newOptions[index], [field]: value };
      } else {
        // 주어진 인덱스에 해당하는 옵션이 없으면 새로운 요소 추가
        newOptions.push({ [field]: value });
      }

      // 이전 상태를 복사하고 새로운 options 배열을 할당하여 상태 업데이트
      return { ...prevProductInfo, options: newOptions };
    });
  };

  // 상품의 옵션 추가
  const addProductOption = (index, tryAgain = true) => {
    // 서버로 데이터 전송하는 로직 작성
    //var formData = new FormData();
    //formData.append('optionDTO', new Blob([JSON.stringify(optionDTO)], { type: "application/json" }));
    console.log("문자열:" + productName, productId);
    console.log("몇 번째 인덱스 입니까?", index);

    if (index >= optionIndex) {
      var data = {
        productPrice: productInfo.options[index].productPrice,
        productSize: productInfo.options[index].productSize,
        productColor: productInfo.options[index].productColor,
        productStock: productInfo.options[index].productStock,
      };
      console.log("담긴 옵션 정보:" , JSON.stringify(data));
      data = JSON.stringify(data);
      console.log("등록 으로")
      axios // 등록
    .put(
      `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}product/seller/option/add/product/${productId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    )
    .then((response) => {
      console.log(response.data); // 서버 응답 출력
      message.success("저장되었습니다");
    })
    .catch(async(error) => {
      console.error(error); // 오류 처리
      if (error.response && error.response.status === 401 && tryAgain) {
        const RefreshToken = localStorage.getItem("RefreshToken");
        await fetchRefreshToken(RefreshToken); // 토큰 갱신 로직 호출
        token = localStorage.getItem("token");
        return addProductOption(index, false); // 재귀 호출
      }

    });
} else {
      console.log("수정 으로");

      let data = {
        optionId: productInfo.options[index].optionId,
        productPrice: productInfo.options[index].productPrice,
        productSize: productInfo.options[index].productSize,
        productColor: productInfo.options[index].productColor,
        productStock: productInfo.options[index].productStock,
        barcodeUrl: productInfo.options[index].barcodeUrl
      };
      console.log("formData는",data);
      axios // 상품 옵션 수정
    .put(
      `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}product/seller/option/${productId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    )
    .then((response) => {
      console.log(response.data); // 서버 응답 출력
      message.success("수정되었습니다");
    })
    .catch((error) => {
      console.error(error); // 오류 처리
      message.error("수정 실패");
    });      console.log(data);
    
    //message.success("저장되었습니다");
  };
  }
  const LoadingScreen = () => {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
        <p style={styles.message}>로딩 중...</p>
      </div>
    );
  };

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      margin: 0,
    },
    spinner: {
      border: "4px solid rgba(0, 0, 0, 0.1)",
      borderLeft: "4px solid #3498db",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      animation: "spin 1s linear infinite",
    },
    message: {
      marginLeft: "10px",
      fontSize: "16px",
    },
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
  };

  if (loading) {
    return <LoadingScreen></LoadingScreen>;
  } else {
    return (
      <div className="seller-product-registration">
        <SellerHeader />
        <ImageCellRenderer images={images} />
        <h1>상품 등록</h1>
        <div className="outer-div">
          <div className="inner-div"></div>
          <Form>
            {/* DropZone */}
            

            <div className="productInfo">
  <Typography.Title level={4}>기본정보</Typography.Title>
  <hr />
  <table>
    <tr>
      <td>상품명</td>
      <td>
        <Input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          count={{
            show: true,
            max: 100,
          }}
        />
      </td>
    </tr>
    <tr>
      <td>상품번호</td>
      <td>자동입력됩니다.</td>
    </tr>
    <tr>
      <td>카테고리</td>
      <td>
        <Space wrap>
          <Select
            defaultValue={selectedCategory}
            style={{ width: 120 }}
            onChange={handleMainCategoryChange}
            options={mainCategory.map((category) => ({
              label: category,
              value: category,
            }))}
          />
        </Space>
      </td>
    </tr>
  </table>
</div>

            <br />

            <div className="price">
              <Typography.Title level={4}>옵션 설정</Typography.Title>
              <hr />
              <div id="option-table">
                <table>
                  {productInfo && productInfo.options
                    ? productInfo.options.map((option, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <div className="option-small-box-w-btn w-btn-indigo">
                              <table>
                                <div>
                                  <td rowSpan={4}>옵션{index + 1}</td>
                                  <Input
                                    placeholder="가격"
                                    style={{ color: "gray" }}
                                    defaultValue={option.productPrice}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "productPrice",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <Input
                                    placeholder="사이즈"
                                    style={{ color: "gray" }}
                                    defaultValue={option.productSize}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "productSize",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <Input
                                    placeholder="색상"
                                    style={{ color: "gray" }}
                                    defaultValue={option.productColor}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "productColor",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <Input
                                    placeholder="수량"
                                    style={{ color: "gray" }}
                                    defaultValue={option.productStock}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "productStock",
                                        e.target.value
                                      )
                                    }
                                  
                                  />
                                  <br /> <br />
                                  <Button
                                    onClick={() => addProductOption(index)}
                                  >
                                    <SaveOutlined />
                                  </Button>
                                  <Button
                                    type="primary"
                                    danger
                                    onClick={() => removeOption(index)}
                                  >
                                    <DeleteOutlined />
                                  </Button>
                                  <Button
                                  style={{ backgroundColor: "black", color: "white" }}
                                    type="primary"
                                    danger
                                    onClick={() => barcodeDownload(index)}
                                  >
                                    <BarcodeOutlined />
                                  </Button>
                                </div>                             
                              </table>                              
                            </div>
                            <br /> <br />
                          </tr>
                        </React.Fragment>
                      ))
                    : null}
                  <div className="big-box">
                    <Button
                      style={{ backgroundColor: "#77C13D", color: "white" }}
                      onClick={plusOption}
                    >
                      <PlusCircleOutlined />
                    </Button>
                  </div>
                </table>
              </div>
              <br /><br />
            </div>

            {/* <div className="abc">
              <Typography.Title level={4}>옵션 목록</Typography.Title>
              <hr />
              <Table
                columns={columns}
                rowSelection={{}}
                dataSource={tableData}
              />

              <br />
            </div> */}

<div className="abc" style={{ display: 'flex', flexDirection: 'column' }}>
<div>
  <Typography.Title level={4}>상품 이미지</Typography.Title>
  <hr />
  <input
    type="file"
    style={{ display: "none" }}
    onChange={handleFileInputChange}
    ref={fileInputRef}
  />
  <Button
    onClick={() => fileInputRef.current.click()}
    icon={<UploadOutlined />}
    style={{margin: '20px'}}
  >
    파일 선택
  </Button>
</div>
<div>
  {previewImage ? (
    <img src={previewImage} alt="미리 보기" style={{maxWidth: '100%', height: 'auto'}} />
  ) : (
    images && images.length > 0 && 
    <img src={images[0]} alt="상품 이미지" style={{maxWidth: '100%', height: 'auto'}} />
  )}
</div>
<br /><br />
</div >
<div style={{ display: 'flex', justifyContent: 'right' }}>
            <Button 
             style={{
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '10px 20px',
              backgroundColor: 'white',
              color: 'black',
              border: '2px solid transparent',
              outline: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
              backgroundColor: '#f0f0f0',
              border: '2px solid blue',
              cursor: 'pointer',
              },
            }}
            onClick={handleSubmitButtonClick}>저장</Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
