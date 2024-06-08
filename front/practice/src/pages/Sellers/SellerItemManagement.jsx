import "./Seller.css";
import SellerHeader from "./SellerHeader.jsx";

import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { useParams } from "react-router-dom";
import ImageCellRenderer from "../../components/ImageCellRenderer";
import { fetchRefreshToken } from "../../utils/authUtil";

import CellRenderer from "./CellRenderer.jsx";
import { message } from "antd";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen.jsx";

// SellerItemManagement 컴포넌트 정의
export default function SellerItemManagement({images}) {
  const { storeId } = useParams();

 // 숫자로 변환
  const storeIdNumber = parseInt(storeId, 10);

  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [savedRowData, setSavedRowData] = useState([]);
  let token = sessionStorage.getItem("token");
  const [productInfo, setProductInfo] = useState({ result: "", data: [] });
  const [loading, setLoading] = useState(true);

  const [rowData, setRowData] = useState();
  useEffect(() => {
    setRowData(images);
  }, [images]);
  
  var fetchData;

    fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}product/all/store/${storeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        if (response.status === 401) {
          let RefreshToken = sessionStorage.getItem("RefreshToken");
          await fetchRefreshToken(RefreshToken);
          token = sessionStorage.getItem("token");
        }
  

      setRowData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("실패");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // 삭제 버튼의 onClick 핸들러
  const handleDelete = async () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);

    for (let item of selectedData) {
      try {
        const response = await axios.delete(
          `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}product/seller/${storeId}/${item.productId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Option deleted successfully");
          fetchData();
        } else {
          console.log("Failed to delete option:", response.status);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const [columnDefs, setColumnDefs] = useState([   
    {
      headerName: "상품사진",
      field: "images",
      headerClass: "center-header", // 각 컬럼에 headerClass 추가
      minWidth: 180,
      wrapText: true,
      autoHeight: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      editable: false,
      cellRenderer: ImageCellRenderer,
      cellStyle: function(params) {
        if (params.column.colId === 'productUrls') { // 체크박스가 있는 컬럼 ID
          //return { textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems:'center', height:'100%'}; // 체크박스에 적용할 스타일
        } else {
          //return { whiteSpace: 'pre-wrap', textAlign: 'center', justifyContent: 'center',  autoHeight: true }; // 체크박스가 아닌 셀에 적용할 스타일
        }
      },
    },
    {
      headerName: "상품명",
      field: "productName",
      headerClass: "center-header", // 각 컬럼에 headerClass 추가
      editable: false,
      wrapText: true,
      autoHeight: true,
      minWidth: 180,
    },
    {
      headerName: "상품코드",
      field: "productId",
      headerClass: "center-header",
      wrapText: true,
      autoHeight: true,
      editable: false,
      filter: true,
    },
    {
      headerName: "사이즈",
      field: "productSize",
      headerClass: "center-header",
      wrapText: true,
      autoHeight: true,
      editable: false,
      filter: true,
      valueGetter: (params) =>
        params.data.options
          ? params.data.options.map((option) => option.productSize).join("\n")
          : "",
    },
    {
      headerName: "색상",
      field: "productColor",
      headerClass: "center-header",
      wrapText: true,
      autoHeight: true,
      editable: false,
      minWidth: 150,
      filter: true,
      valueGetter: (params) =>
        params.data.options
          ? params.data.options.map((option) => option.productColor).join("\n")
          : "",
    },

    {
      headerName: "재고 수량",

      headerClass: "center-header",
      editable: false,
      wrapText: true,
      autoHeight: true,
      filter: true,
      valueGetter: (params) =>
        params.data.options
          ? params.data.options.map((option) => option.productStock).join("\n")
          : "",
    },
    {
      headerName: "관리",
      headerClass: "center-header",
      wrapText: true,
      autoHeight: true,
      editable: false,
      minWidth: 150,
      cellRenderer: (params) => {
        //const { storeId } = this.props; // storeId를 적절한 방법으로 가져옴
        const productId = params.data.productId; // productId를 params에서 추출
         
        return (
          <CellRenderer storeId={storeIdNumber} productId={productId} {...params} />
        );
      },
    },
  ]);

  const getRowId = useCallback((row) => {
    return row.id;
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 110,
      editable: true,
      resizable: true,
    };
  }, []);


  const createProduct = async () => {
    var data = {
      productId: "",
      storeId: storeId,
      productName: "",
      productCategory: "",
      productUrls: [],
    };
    var formData = new FormData();
    formData.append(
      "productDTO",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    const response = await fetch(
      `${process.env.NODE_ENV === 'development' ? '' : ''}${process.env.REACT_APP_API_URL}product/seller`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      }
    )
      .then((response) => {
        if (response.status === 200) {
          message.success("새로운 상품을 등록하였습니다.");
          //setNewProduct(response.json()); // JSON 형식의 응답을 파싱
        }
      })
      .then((data) => {
        fetchData();
      })
      .catch((error) => {
        message.error("새로운 상품 등록에 실패하였습니다.");
        console.log("에러입니다. 에러에러");
        console.log(error);
        return data;
      });
  };
  

  if (loading) {
    <LoadingScreen> </LoadingScreen>;
  } else {
    return (
      <div style={containerStyle}>
        <div className="seller-item-management">
          <SellerHeader />
          {/* <SellerItem /> */}
          <div
            style={{
              marginBottom: "5px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
            
              <button
                class="w-btn w-btn-indigo"
                type="button"
                style={{ padding: '10px 20px', margin: '10px' }}
            
                onClick={() => {
                  createProduct();
                      }}
              >
                추가
              </button>
                
              <button
                class="w-btn w-btn-indigo"
                type="button"
                onClick={handleDelete}
                style={{ padding: '10px 20px' }}
              >
                삭제
              </button>

            </div>

          </div>
          <div className="grid-wrapper">
            <div style={gridStyle} className="ag-theme-alpine">
              <AgGridReact
                ref={gridRef}
                columnDefs={columnDefs}
                rowData={rowData}
                getRowNodeId={getRowId}
                defaultColDef={
                  {defaultColDef,
                   
                    cellStyle: (params) => {
                      const isProductUrlsColumn = params.column.colId === 'productUrls';
                      return {
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        whiteSpace: 'pre-wrap',
                        textAlign: 'center',
                        cellClass: 'ag-no-row-height-limit',
                        lineHeight: '130%',
                        
                        ...(isProductUrlsColumn && {
                          wordSpacing: '0',
                          //lineHeight: '1.5',
                        }),
                      };
                    },
                  }}
                suppressRowClickSelection={true}
                rowSelection={"multiple"}
                rowHeight={100}
                frameworkComponents={{
                  ImageCellRenderer: ImageCellRenderer, // 컴포넌트 등록
                  cellRenderer: CellRenderer,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
