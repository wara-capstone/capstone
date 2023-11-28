import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import "@toast-ui/editor/dist/i18n/ko-kr";
import { Editor } from "@toast-ui/react-editor";
import axios from "axios";

import { UploadOutlined } from '@ant-design/icons';

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
const { TextArea } = Input;

const mainCategory = [
  "상의",
  "아우터",
  "바지",
  "원피스/스커트",
  "신발",
  "가방",
];

const smallCategory = {
  상의: [
    "맨투맨/스웨트셔츠",
    "셔츠/블라우스",
    "후드 티셔츠",
    "니트/스웨터",
    "긴소매 티셔츠",
    "반소매 티셔츠",
    "기타 상의",
  ],
  아우터: [
    "후드 집업",
    "카디건",
    "플리스/뽀글이",
    "코트",
    "패딩",
    "기타 아우터",
  ],
  바지: ["데님 팬츠", "코튼 팬츠", "트레이닝/조거 팬츠", "기타바지"],
  원피스스커트: ["원피스", "스커트"],
  신발: ["스니커즈", "샌들", "부츠", "로퍼", "기타 신발"],
  가방: [
    "백팩",
    "메신저/크로스 백",
    "숄더백",
    "토트백",
    "에코백",
    "지갑/머니클립",
    "기타 소품",
  ],
};

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
  const { storeId, productId } = useParams();
  const [tableData, setTableData] = useState(initialData);
  const [mainCategory, setMainCategory] = React.useState("상의");
  const [secondCategory, setSecondCategory] =
    React.useState("맨투맨/스웨트셔츠");
  // onChange로 관리할 문자열
  const [hashtag, setHashtag] = useState("");
  // 해시태그를 담을 배열
  const [hashArr, setHashArr] = useState([]);

  const handleMainCategoryChange = (value) => {
    setMainCategory(value);
    setSecondCategory(smallCategory[value][0]);
  };

  const onSecondCategoryChange = (value) => {
    setSecondCategory(value);
  };

  const [itemOptions, setItemOption] = useState();
  const token = sessionStorage.getItem("token");
  const [productInfo, setProductInfo] = useState({});
  //  const { productId } = props.location?.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 단일 상품 조회
        setLoading(true);
        const response = await axios.get(
          `https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/product/all/${productId}`,
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
          setproductOptions(response.data);
        } else {
          setProductInfo({ data: [] });
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
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProducPrice] = useState("");
  const [productSize, setProductSize] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productColor, setProducColor] = useState("");

  const [salePrice, setSalePrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [discount, setDiscount] = useState("noDiscount");
  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]); // 옵션2에 대한 상태

  const [editingKey, setEditingKey] = useState(null);

  const [options, setOptions] = useState([{ items: ["사이즈 (예시: s)"] }]);
  const handleSalePriceChange = (e) => {
    setSalePrice(e.target.value);
  };

  const handleDiscountPriceChange = (e) => {
    setDiscountPrice(e.target.value);
  };

  const handleDiscountChange = (e) => {
    setDiscount(e.target.value);
  };

  const discountedSalePrice = salePrice - discountPrice;

  const handleSubmitButtonClick = () => {
    // 서버로 데이터 전송하는 로직 작성
    axios // 상품 등록
      .post(
        `https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/product/seller`,
        {
          headers: {
            //"Content-Type" : "multipart/form-data",
            Authorization: token,
          },
          productDTO: {
            //productId: productId,
            //storeId: storeId,
            productName: productName,
            productCategory: productCategory,
            //sellerProductCode: sellerProductCode,
          },
          optionDTO: {
            productPrice: productPrice,
            productSize: productSize,
            productColor: productColor,
            productStock: productStock,
          },
        }
      )
      .then((response) => {
        console.log(response.data); // 서버 응답 출력
      })
      .catch((error) => {
        console.error(error); // 오류 처리
      });

    message.success("저장되었습니다");
  };

  const addOption = () => {
    setOptions(options.concat([]));
  };

  const removeOption = (indexToRemove) => {
    setproductOptions((prevOptions) =>
      prevOptions.filter((_, index) => index !== indexToRemove)
    );
  };

  // 행을 생성하는 함수
  const createRow = (index, addFunc, removeFunc) => (
    <tr key={index}>
      <td>
        <Input style={{ color: "gray" }} />
      </td>
      <td>
        <Button onClick={() => addFunc(index)}>
          <PlusCircleOutlined />
        </Button>
        <Button type="primary" danger onClick={() => removeFunc(index)}>
          <DeleteOutlined />
        </Button>
      </td>
    </tr>
  );

  // 배열 내에 원소를 삽입하는 함수
  const insertRow = (prevRows, index, newRow) => {
    const newRows = [...prevRows];
    newRows.splice(index, 0, newRow);
    return newRows;
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



  const [productOptions, setproductOptions] = useState([{
    productPrice: '',
    productSize: '',
    productColor: '',
    productStock: '',
  }]);



  const plusOption = () => {
    const newOption = {
      productPrice: '',
      productSize: '',
      productColor: '',
      productStock: '',
    };
  
    // 새로운 옵션을 추가한 새로운 배열을 생성
    const newOptions = [...productInfo.options, newOption];
  
    // 상태 업데이트 함수를 호출하여 새로운 배열로 상태를 업데이트
    setProductInfo(prevProductInfo => ({
      ...prevProductInfo,
      options: newOptions,
    }));
  };
  
  



  const [quillValue, setQuillValue] = useState("");

  const handleQuillChange = (content, delta, source, editor) => {
    setQuillValue(editor.getContents());
  };

  const [loading, setLoading] = useState(true);
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      margin: 0,
    },
    spinner: {
      border: '4px solid rgba(0, 0, 0, 0.1)',
      borderLeft: '4px solid #3498db',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
    },
    message: {
      marginLeft: '10px',
      fontSize: '16px',
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  };



  const [price, setPrice] = useState({ buy: "", sell: "", discount: "" });
  if (loading) {
    return <LoadingScreen></LoadingScreen>
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
            <div className="abc">
              <Typography.Title level={4}>표시여부</Typography.Title>
              <hr />
              <div>
                {/* <table>
                <tr>
                  <td>진열상태<br/>
                      품질처리<br/>
                      
                    </td>
                </tr>
              </table> */}
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
            </div>
            <br />
            <div className="productInfo">
              <Typography.Title level={4}>기본정보</Typography.Title>
              <hr />
              <table>
                <tr>
                  <td>상품명&nbsp;</td>
                  <Input
                    value={productInfo.productName}
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
                      defaultValue={mainCategory}
                      style={{ width: 120 }}
                      onChange={handleMainCategoryChange}
                      options={Object.keys(smallCategory).map((category) => ({
                        label: category,
                        value: category,
                      }))}
                    />
                    <Select
                      style={{ width: 120 }}
                      value={secondCategory}
                      onChange={onSecondCategoryChange}
                      options={smallCategory[mainCategory].map((category) => ({
                        label: category,
                        value: category,
                      }))}
                    />
                  </Space>
                </tr>
                <br />
                <tr>
                  <td>수량</td>
                  <td>
                    <Input
                      value={productInfo.options[0].productStock}
                      count={{
                        show: true,
                      }}
                    />
                  </td>
                </tr>

                <tr>
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
                </tr>

                <br />
              </table>
            </div>
            <br />
            <br />

            <div className="price">
              <Typography.Title level={4}>옵션 설정</Typography.Title>
              <hr />
              <div id="option-table">
                <table>
                  {productOptions.options.map((option, index) => (

                    <React.Fragment key={index}>
                      <tr>
                        <div className="option-small-box">
                          <table>
                            <div>
                              <td rowSpan={4}>옵션{++index}</td>
                              <Input
                                placeholder="가격"
                                style={{ color: 'gray' }}
                                defaultValue={option.productPrice}
                              />
                              <Input
                                placeholder="사이즈"
                                style={{ color: 'gray' }}
                                defaultValue={option.productSize}
                              />
                              <Input
                                placeholder="색상"
                                style={{ color: 'gray' }}
                                defaultValue={option.productColor}
                              />
                              <Input
                                placeholder="수량"
                                style={{ color: 'gray' }}
                                defaultValue={option.productStock}
                              />
                              <Button onClick={plusOption}></Button>
                              <Button onClick={plusOption}>
                                <PlusCircleOutlined />
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
                  ))}
                </table>
              </div>
            </div>

            <div className="abc">
              <Typography.Title level={4}>옵션 목록</Typography.Title>
              <hr />
              <Table
                columns={columns}
                rowSelection={{}}
                dataSource={tableData}
              />

              <br />
            </div>

            <div className="abc">
              <Typography.Title level={4}>상품 이미지</Typography.Title>
              <hr />

              <Upload
                action=""
                listType="picture"
                defaultFileList={[[]]}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
              { /*
              <br />
              <br />
              <Upload
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture"
                defaultFileList={[]}
                className="upload-list-inline"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload> */}

              <br />
            </div>

            <div className="abc">
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
              // hooks={{
              //   addImageBlobHook: async (blob, callback) => {
              //     try {
              //       const imageData = new FormData();

              //       // OptionDTO 추가
              //       imageData.append("OptionDTO", optionValue); // optionValue는 실제 OptionDTO의 값입니다.

              //       // ProductDTO 추가
              //       imageData.append("ProductDTO", productValue); // productValue는 실제 ProductDTO의 값입니다.

              //       // 이미지 추가 (Images 키로 여러 이미지 추가)
              //       for (let i = 0; i < blobs.length; i++) {
              //         const blob = blobs[i]; // blobs는 실제 이미지 blob들의 배열입니다.
              //         const file = new File([blob], encodeURI(blob.name), {
              //           type: blob.type,
              //         });
              //         imageData.append("Images", file);
              //       }

              //       // 서버에 전송
              //       const imageURI = await axios({
              //         method: "POST",
              //         headers: {
              //           "Content-Type": "multipart/form-data",
              //         },
              //         url: `${"https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app"}/product/seller`,
              //         data: imageData,
              //         withCredentials: true,
              //       });
              //     } catch (error) {
              //       console.log(error);
              //     }
              //   },
              // }}
              />

              <br />
            </div>

            <div className="abc">
              <Typography.Title level={4}>상품 정보 제공 공시</Typography.Title>
              <hr />

              <br />
            </div>

            <Button onClick={handleSubmitButtonClick}>확인</Button>
          </Form>
        </div>
      </div>
    );
  }
}
