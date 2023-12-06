import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import "@toast-ui/editor/dist/i18n/ko-kr";
import { Editor } from "@toast-ui/react-editor";
import axios from "axios";
import { UploadFile } from "antd/es/upload/interface";

import { UploadOutlined } from "@ant-design/icons";

import "@toast-ui/editor/dist/toastui-editor.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import ToastuiEditor, {
  EditorOptions,
  ViewerOptions,
  EventMap,
} from "@toast-ui/editor";
import ToastuiEditorViewer from "@toast-ui/editor/dist/toastui-editor-viewer";

import {
  PlusCircleOutlined,
  SaveOutlined,
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import SellerHeader from "./SellerHeader";
import {
  Typography,
  Button,
  Form,
  Input,
  Radio,
  Checkbox,
  Select,
  Space,
  message,
  Upload,
} from "antd";
import "./Seller.css";
import CellRenderer from "./CellRenderer";
const { TextArea } = Input;

const mainCategory = ["상의", "아우터", "하의", "신발", "잡화", "기타"];

// const smallCategory = {
//   상의: [
//     "맨투맨/스웨트셔츠",
//     "셔츠/블라우스",
//     "후드 티셔츠",
//     "니트/스웨터",
//     "긴소매 티셔츠",
//     "반소매 티셔츠",
//     "기타 상의",
//   ],
//   아우터: [
//     "후드 집업",
//     "카디건",
//     "플리스/뽀글이",
//     "코트",
//     "패딩",
//     "기타 아우터",
//   ],
//   바지: ["데님 팬츠", "코튼 팬츠", "트레이닝/조거 팬츠", "기타바지"],
//   원피스스커트: ["원피스", "스커트"],
//   신발: ["스니커즈", "샌들", "부츠", "로퍼", "기타 신발"],
//   가방: [
//     "백팩",
//     "메신저/크로스 백",
//     "숄더백",
//     "토트백",
//     "에코백",
//     "지갑/머니클립",
//     "기타 소품",
//   ],
// };

const initialData = [
  {
    key: "1",
    checked: false,
    option: ["FREE", "크림"],
    price: "10",
    stock: "100",
  },
  {
    key: "2",
    checked: false,
    option: ["FREE", "네이비"],
    price: "20",
    stock: "200",
  },
  {
    key: "3",
    checked: false,
    option: ["FREE", "블랙"],
    price: "30",
    stock: "300",
  },
];

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

export default function SellerProductRegistration(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { storeId, productId } = useParams();
  const [tableData, setTableData] = useState(initialData);
  const [optionIndex, setOptionIndex] = useState(0);

  // onChange로 관리할 문자열
  const [hashtag, setHashtag] = useState("");
  // 해시태그를 담을 배열
  const [hashArr, setHashArr] = useState([]);

  const [mainCategory, setMainCategory] = useState([
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

  const [itemOptions, setItemOption] = useState();
  const token = localStorage.getItem("token");
  const [productInfo, setProductInfo] = useState({});
  //  const { productId } = props.location?.state || {};
  const [isTrue, setIsTrue] = useState();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 단일 상품 조회
        setLoading(true);
        const response = await axios.get(
          `http://52.79.186.117:8000/api/product/all/${productId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        console.log("받아온 값!!:" + JSON.stringify(response.data)); // 서버로부터 받아온 데이터를 JSON 문자열로 변환하여 출력
        console.log(response.status);
        if (response.status == 200) {
          setProductInfo(response.data);
          setImages(response.data.productUrls);
          setProductName(response.data.productName || "");
          setSelectedCategory(response.data.productCategory);
          setIsTrue(true);

          setOptionIndex(response.data.options.length);
          console.log("옵션이 존재??? ", response.data.options);
        } else {
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
  }, []);

  const onKeyUp = useCallback(
    (e) => {
      if (typeof window !== "undefined") {
        /* 요소 불러오기, 만들기*/
        const $HashWrapOuter = document.querySelector(".HashWrapOuter");
        const $HashWrapInner = document.createElement("div");
        $HashWrapInner.className = "HashWrapInner";

        /* 태그를 클릭 이벤트 관련 로직 */
        $HashWrapInner.addEventListener("click", () => {
          $HashWrapOuter?.removeChild($HashWrapInner);
          console.log($HashWrapInner.innerHTML);
          setHashArr(hashArr.filter((hashtag) => hashtag));
        });

        /* enter 키 코드 :13 */
        if (e.keyCode === 13 && e.target.value.trim() !== "") {
          console.log("Enter Key 입력됨!", e.target.value);
          $HashWrapInner.innerHTML = "#" + e.target.value;
          $HashWrapOuter?.appendChild($HashWrapInner);
          setHashArr((hashArr) => [...hashArr, hashtag]);
          setHashtag("");
        }
      }
    },
    [hashtag, hashArr]
  );

  // 서버로 보낼 변수들 이름 지정
  const [productName, setProductName] = useState(
    productInfo ? productInfo.productName : ""
  );
  const [productCategory, setProductCategory] = useState(
    productInfo ? productInfo.productCategory : ""
  );

  const [editingKey, setEditingKey] = useState(null);
  const [options, setOptions] = useState([{ items: ["사이즈 (예시: s)"] }]);

  const [productStock, setProductStock] = useState(
    productInfo && productInfo.options && productInfo.options[0]
      ? productInfo.options[0].productStock
      : ""
  );
  const [productPrice, setProductPrice] = useState(
    productInfo && productInfo.options && productInfo.options[0]
      ? productInfo.options[0].productPrice
      : ""
  );
  const [productSize, setProductSize] = useState(
    productInfo && productInfo.options && productInfo.options[0]
      ? productInfo.options[0].productSize
      : ""
  );
  const [productColor, setProductColor] = useState(
    productInfo && productInfo.options && productInfo.options[0]
      ? productInfo.options[0].productColor
      : ""
  );

  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(false);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
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

  const [saveData, setSaveData] = useState({
    "": "",
    "": "",
    "": "",
  });

  const handleSubmitButtonClick = async () => {
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

      formData.append(
        "productDTO",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );
      fetch("http://52.79.186.117:8000/api/product/seller", {
        method: "PUT",
        headers: headers,
        body: formData,
      }).then((response) => {
        if (response.status === 200) {
          message.success("저장되었습니다.");
        } else {
          message.error("error");
        }
      });
      formData = new FormData();

      if (file) {
        console.log("file : " + file);
        formData.append("images", file);
        fetch(
          "http://52.79.186.117:8000/api/product/seller/product/" + productId,
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

  const removeOption = async (index) => {
    try {
      // 1. 서버에 삭제 요청 보내기
      const response = await axios.delete(
        `http://52.79.186.117:8000/api/product/seller/option/${
          productInfo.options[index - 1].optionId
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
      } else {
        console.log("Failed to delete option:", response.status);
        
      }

      // 2. 상태 업데이트하기
      setProductInfo((prevProductInfo) => {
        const newOptions = [...prevProductInfo.options];
        newOptions.splice(index - 1, 1);

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

  const columns = [
    {
      title: "상품명",
      dataIndex: "name",
      render: (text, { key }) =>
        key === editingKey ? (
          <Input
            defaultValue={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        ) : (
          <Button
            onClick={() => {
              setEditingKey(key);
              setProductName(text);
            }}
          >
            {text}
          </Button>
        ),
    },
    { title: "가격", dataIndex: productPrice },
    { title: "색상", dataIndex: productColor },
    { title: "사이즈", dataIndex: productSize },
    {
      title: "수량",
      render: (_, { key }) =>
        key === editingKey && (
          <Button
            onClick={() => {
              setTableData((prevData) =>
                prevData.map((item) =>
                  item.key === key ? { ...item, name: productName } : item
                )
              );
              setEditingKey(null);
            }}
          >
            Confirm
          </Button>
        ),
    },
  ];

  const [value, setValue] = useState("");
  const [isDisable, setIsDisable] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      [{ align: [] }, { color: [] }, { background: [] }],
      ["clean"],
    ],
    ImageResize: { modules: ["Resize"] },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "color",
    "background",
  ];

  let plusOption = () => {
    const newOption = {
      productPrice: "",
      productSize: "",
      productColor: "",
      productStock: "",
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

  const [quillValue, setQuillValue] = useState("");

  const handleQuillChange = (content, delta, source, editor) => {
    setQuillValue(editor.getContents());
  };

  const [imageUrl, setImageUrl] = useState();

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  // 상품의 옵션 추가
  const addProductOption = (index) => {
    // 서버로 데이터 전송하는 로직 작성
    //var formData = new FormData();
    //formData.append('optionDTO', new Blob([JSON.stringify(optionDTO)], { type: "application/json" }));
    console.log("문자열:" + productInfo.productId);
    console.log("몇 번째 인덱스 입니까?", index);
    console.log("담긴 옵션 정보" + productInfo.options[index].productPrice);
    if (index > optionIndex) {
      var data = {
        productPrice: productInfo.options[index].productPrice,
        productSize: productInfo.options[index].productSize,
        productColor: productInfo.options[index].productColor,
        productStock: productInfo.options[index].productStock,
      };
      data = JSON.stringify(data);
      console.log("등록 으로");
      message.error("asdasd");
      axios // 등록
        .put(
          `http://52.79.186.117:8000/api/product/seller/option/add/product/${productInfo.productId}`,
          // `https://port-0-product-server-3yl7k2blonzju2k.sel5.cloudtype.app/product/seller/option/add?productId=19`,
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
        })
        .catch((error) => {
          console.error(error); // 오류 처리
        });
    } else {
      console.log("수정 으로");
      var data = {
        optionId: productInfo.options[index].optionId,
        productPrice: productInfo.options[index].productPrice,
        productSize: productInfo.options[index].productSize,
        productColor: productInfo.options[index].productColor,
        productStock: productInfo.options[index].productStock,
      };
      data = JSON.stringify(data);
      //var formdata = new FormData();
      //formdata.append("optionDTO", new Blob([JSON.stringify(data)], { type: "application/json" }))
      console.log(data);
      axios // 상품 등록
        .put(
          `http://52.79.186.117:8000/api/product/seller/option/` + productId,
          // `https://port-0-product-server-3yl7k2blonzju2k.sel5.cloudtype.app/product/seller/option/add?productId=19`,
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
        })
        .catch((error) => {
          console.error(error); // 오류 처리
        });
    }
    message.success("저장되었습니다");
  };

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

  const imageHandler = (data) => {};
  const [fileList, setFileList] = useState([]);

  const uploadProps = {
    // action: `http://52.79.186.117:8000/api/product/seller/option/add/product/${productInfo.productId}`,
    // action:"http://52.79.186.117:8000/api/product/seller",
    listType: "picture",
    className: "upload-list-inline",
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false; // 업로드 중단
    },
    fileList, // 수정: fileList 속성 사용
  };

  if (loading) {
    return <LoadingScreen></LoadingScreen>;
  } else {
    return (
      <div className="seller-product-registration">
        <SellerHeader />
        <h1>상품 등록</h1>
        <div className="outer-div">
          <div className="inner-div"></div>
          <Form>
            {/* DropZone */}
            <br />
            <br />
            {/* <div className="abc">
              <Typography.Title level={4}>표시여부</Typography.Title> */}

            {/* <div>
                <table>
                  <tr>
                    <td>
                      진열상태
                      <br />
                      품질처리
                      <br />
                    </td>
                  </tr>
                </table>
                <label>진열상태&nbsp;</label>
                <Radio>진열</Radio>
                <Radio>미진열</Radio>
                <br />
                <label>품절처리&nbsp;</label>
                <Checkbox>품절</Checkbox>
                <dd>
                  강제 품질을 체크하면 해당 상품은 고객에게 [품절]로 노출되며,
                  구매가 불가능해집니다.
                </dd>
              </div>
              <br />
            </div> */}
            <br />

            <div className="productInfo">
              <Typography.Title level={4}>기본정보</Typography.Title>
              <hr />
              <table>
                <tr>
                  <td>상품명&nbsp;</td>
                  <Input
                    value={productName} // 수정: 값이 없는 경우 빈 문자열을 사용
                    onChange={(e) => setProductName(e.target.value)}
                    count={{
                      show: true,
                      max: 100,
                    }}
                  />
                </tr>
                <br />
                <tr>
                  <td>상품번호&nbsp;</td>
                  <td>자동입력됩니다.</td>
                </tr>
                <br />
                <tr>
                  <td>카테고리&nbsp;</td>
                  <Space wrap>
                    <Select
                      defaultValue={selectedCategory} // 선택한 카테고리 값으로 초기화
                      style={{ width: 120 }}
                      onChange={handleMainCategoryChange}
                      options={mainCategory.map((category) => ({
                        label: category,
                        value: category,
                      }))}
                    />
                  </Space>
                </tr>
                <br />
                {/* <tr>
                  <td>수량</td>
                  <td>
                    <Input
                      value={productInfo.productStock}
                      onChange={(e) => setProductStock(e.target.value)}
                      count={{
                        show: true,
                      }}
                    />
                  </td>
                </tr> */}

                {/* <tr>
                  <td>해시태그</td>
                  <td>
                    <div className="HashWrap">
                      <div className="HashWrapOuter">
                        {hashArr.map((hashtag, index) => (
                          <div key={index} className="HashWrapInner">
                            #{hashtag}
                          </div>
                        ))}
                      </div>
                      <input
                        className="HashInput"
                        type="text"
                        defaultValue={hashtag}
                        //onChange={onChangeHashtag}
                        onKeyUp={onKeyUp}
                        placeholder="해시태그 입력"
                      />
                    </div>
                  </td>
                </tr> */}

                <br />
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
                            <div className="option-small-box">
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
                                </div>
                              </table>
                            </div>
                          </tr>
                        </React.Fragment>
                      ))
                    : null}
                  <div className="big-box">
                    <Button
                      style={{ backgroundColor: "black", color: "white" }}
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
    >
      파일 선택
    </Button>
  </div>
  <div>
    {previewImage && <img src={previewImage} alt="미리 보기" style={{maxWidth: '100%', height: 'auto'}} />}
  </div>
  <br /><br />
</div>

            {/* 이미지 에디터 코드 */}
            {/* <div className="abc">
              <Typography.Title level={4}>에디터</Typography.Title>
              <hr />
              <Editor
                //initialValue="hello react editor world!"
                previewStyle="vertical"
                height="600px"
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                hideModeSwitch={true}
                plugins={[colorSyntax]}
                language="ko-KR"
              hooks={{
                addImageBlobHook: async (blob, callback) => {
                  try {
                    const imageData = new FormData();

                    // OptionDTO 추가
                    imageData.append("OptionDTO", optionValue); // optionValue는 실제 OptionDTO의 값입니다.

                    // ProductDTO 추가
                    imageData.append("ProductDTO", productValue); // productValue는 실제 ProductDTO의 값입니다.

                    // 이미지 추가 (Images 키로 여러 이미지 추가)
                    for (let i = 0; i < blobs.length; i++) {
                      const blob = blobs[i]; // blobs는 실제 이미지 blob들의 배열입니다.
                      const file = new File([blob], encodeURI(blob.name), {
                        type: blob.type,
                      });
                      imageData.append("Images", file);
                    }

                    // 서버에 전송
                    const imageURI = await axios({
                      method: "POST",
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                      url: `${"http://52.79.186.117:8000/api"}/product/seller`,
                      data: imageData,
                      withCredentials: true,
                    });
                  } catch (error) {
                    console.log(error);
                  }
                },
              }}
              />

              <br />
            </div> */}

            {/* <div className="abc">
              <Typography.Title level={4}>상품 정보 제공 공시</Typography.Title>
              <hr />

              <br />
            </div> */}

            <Button onClick={handleSubmitButtonClick}>저장</Button>
          </Form>
        </div>
      </div>
    );
  }
}
