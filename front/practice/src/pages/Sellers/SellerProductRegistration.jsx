import React, { useState, useCallback, useEffect } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";

import { PlusCircleOutlined,DeleteOutlined, PlusOutlined, LoadingOutlined} from "@ant-design/icons";
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
  Upload
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
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};


export default function SellerProductRegistration() {
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

  useEffect(() => {
    console.log(itemOptions);
  }, [itemOptions]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/product/all/19",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      const result = await response.json();
      if (response.status === 200) {
        console.log(result);
        setItemOption(result);
      } else {
        console.log("실패");
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

  const [salePrice, setSalePrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [discount, setDiscount] = useState("noDiscount");
  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]); // 옵션2에 대한 상태

  const [editingKey, setEditingKey] = useState(null);
  const [nameInput, setNameInput] = useState("");

  const [options, setOptions] = useState([
    { items: ["옵션 항목 (예시: s)"] },
  ]);
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

  const handleButtonClick = () => {
    message.success("저장되었습니다");
  };

  const addOption = () => {
    setOptions(options.concat([{ items: ["옵션 항목 (예시: s)"] }]));
  };

  const removeOption = (indexToRemove) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  // 옵션1에 대한 행 추가
  const addRow = (index) => {
    const newRow = createRow(index, addRow, removeRow);
    setRows((prevRows) => insertRow(prevRows, index, newRow));
  };

  // 옵션2에 대한 행 추가
  const addRow2 = (index) => {
    const newRow = createRow(index, addRow2, removeRow2);
    setRows2((prevRows) => insertRow(prevRows, index, newRow));
  };

  // 옵션1에 대한 행 삭제
  const removeRow = (index) => {
    setRows((prevRows) =>
      prevRows.filter((row, rowIndex) => rowIndex !== index)
    );
  };

  // 옵션2에 대한 행 삭제
  const removeRow2 = (index) => {
    setRows2((prevRows) =>
      prevRows.filter((row, rowIndex) => rowIndex !== index)
    );
  };

  // 행을 생성하는 함수
  const createRow = (index, addFunc, removeFunc) => (
    <tr key={index}>
      <td>
        <Input style={{ color: "gray" }}  />
      </td>
      <td>
        <Button onClick={() => addFunc(index + 1)}>
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
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
        ) : (
          <Button
            onClick={() => {
              setEditingKey(key);
              setNameInput(text);
            }}
          >
            {text}
          </Button>
        ),
    },
    { title: "가격", dataIndex: "age" },
    { title: "사이즈", dataIndex: "address" },
    {
      title: "수량",
      render: (_, { key }) =>
        key === editingKey && (
          <Button
            onClick={() => {
              setTableData((prevData) =>
                prevData.map((item) =>
                  item.key === key ? { ...item, name: nameInput } : item
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
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
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


  
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  
  return (
    <div className="seller-product-registration">
      <SellerHeader />
      <h1>상품 등록</h1>
      <div className="outer-div">
        <div className="inner-div">
          <h2 level={2}>상품 업로드</h2>
        </div>

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
          <div className="category">
            <Typography.Title level={5}>
              카테고리(한 개만 지정 가능)
            </Typography.Title>{" "}
            <hr />
            <label>선택&nbsp;</label>
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
            <br /> <br />
          </div>
          <br />
          <br />
          <div className="productInfo">
            <Typography.Title level={4}>기본정보</Typography.Title>
            <hr />
            <table>
              <tr>
                <td>상품명&nbsp;</td>
                <Input
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
                <td>판매자상품코드</td>
                <td>
                  <Input
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
                      value={hashtag}
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
            <Typography.Title level={4}>가격설정</Typography.Title>
            <hr />
            <table>
              <tr>
                <td>매입가</td>
                <td>
                  <Space.Compact style={{ width: "200px" }}>
                    <Input defaultValue="" />
                    <Button
                      type="primary"
                      style={{ backgroundColor: "#cccccc", color: "black" }}
                    >
                      원
                    </Button>
                  </Space.Compact>
                </td>
              </tr>
              <br />
              <tr>
                <td>판매가</td>
                <td>
                  <Space style={{ width: "200px" }}>
                    <Input defaultValue="" onChange={handleSalePriceChange} />
                    <Button
                      style={{ backgroundColor: "#cccccc", color: "black" }}
                    >
                      원
                    </Button>
                  </Space>
                </td>
              </tr>
              <br />
              <tr>
                <td>할인</td>
                <td>
                  <Radio.Group onChange={handleDiscountChange} value={discount}>
                    <Radio value="discount">설정</Radio>
                    <Radio value="noDiscount">설정안함</Radio>
                  </Radio.Group>

                  {discount === "discount" && (
                    <div>
                      <Space.Compact style={{ width: "200px" }}>
                        <Input
                          defaultValue=""
                          onChange={handleDiscountPriceChange}
                        />
                        <Button
                          style={{ backgroundColor: "#cccccc", color: "black" }}
                        >
                          원
                        </Button>
                      </Space.Compact>
                    </div>
                  )}
                </td>
              </tr>
              <br />
              <tr>
                <td>할인 판매가</td>
                <td>{discountedSalePrice} 원</td>
              </tr>
              <br />
            </table>
          </div>
          <br />
          <br />
          <div className="option">
            <Typography.Title level={4}>옵션 설정</Typography.Title>
            <hr />

            <div id="option-table">
              <table>
                {options.map((option, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <div className="option-small-box">
                        <table>
                          <td rowSpan={4}>옵션{index + 1}</td>
                          <Input
                            style={{ color: "gray" }}
                            defaultValue="색상명"
                          />
                          {option.items.map((item, itemIndex) => (
                            <tr key={itemIndex}>
                              <td>
                                <Input
                                  style={{ color: "gray" }}
                                  defaultValue={item}
                                />
                              </td>
                            </tr>
                          ))}
                          <Button onClick={addOption}>
                            <PlusCircleOutlined />
                          </Button>
                          <Button
                            type="primary"
                            danger
                            onClick={() => removeOption(index)}
                          >
                            <DeleteOutlined />
                          </Button>
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
            <Table columns={columns} rowSelection={{}} dataSource={tableData} />
            
            <br />
          </div>

          <div className="abc">
            <Typography.Title level={4}>상품 이미지</Typography.Title>
            <hr />

            <>
      <Upload
        name="avatar" //서버로 보낼 필드 이름
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188" //이미지를 처리할 수 있는 서버 url
        beforeUpload={beforeUpload}
        onChange={handleChange}
        multiple={true}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
     
    </>
            <br />
          </div>

          <div className="abc">
            <Typography.Title level={4}>에디터</Typography.Title>
            <hr />
            
            <br />
          </div>

          <div className="abc">
            <Typography.Title level={4}>상품 정보 제공 공시</Typography.Title>
            <hr />

            <br />
          </div>

          <Button onClick={handleButtonClick}>확인</Button>
        </Form>
      </div>
    </div>
  );
}
