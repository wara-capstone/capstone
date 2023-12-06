import "./Seller.css";
import SellerHeader from "./SellerHeader.jsx";

import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { useParams } from "react-router-dom";
import ImageCellRenderer from "../../components/ImageCellRenderer";

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
export default function SellerItemManagement() {
  const { storeId } = useParams();

  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [savedRowData, setSavedRowData] = useState([]);
  const token = localStorage.getItem("token");
  const [productInfo, setProductInfo] = useState({ result: "", data: [] });
  const [loading, setLoading] = useState(true);

  const [rowData, setRowData] = useState();
  var fetchData;

    fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//${process.env.REACT_APP_API_URL}product/all/store/${storeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        // data의 옵션값 추출 코드
        // // 데이터 변형
        // const transformedData = response.data.flatMap((item) =>
        //   item.options.map((option) => ({
        //     ...item,
        //     productSize: option.productSize,
        //     productColor: option.productColor,
        //     productStock: option.productStock,
        //   }))
        // );

        // // 데이터 변형
        // const transformedData = response.data.map((item) =>
        // ({
        //   productId: item.productId,
        //   storeId: item.storeId,
        //   productName: item.productName,
        //   productCategory: item.productCategory,
        //   productUrls: item.productUrls,
        //   // options
        // })
        // );

        // const transformedData = response.data.map((item) => {
        //   const options = item.options.map((option) => ({
        //     productSize: [option.productSize],
        //     productColor: [option.productColor],
        //     productStock: [option.productStock],
        //   }));

      


        // setRowData(transformedData);
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
  }, []);

  // 삭제 버튼의 onClick 핸들러
  const handleDelete = async () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);

    for (let item of selectedData) {
      try {
        const response = await axios.delete(
          `${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//${process.env.REACT_APP_API_URL}product/seller/${storeId}/${item.productId}`,
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

  // const transformData = (data) => {
  //   return data.reduce((acc, item) => {
  //     item.options.forEach(option => {
  //       acc.push({
  //         ...item,
  //         productSize: option.productSize,
  //         productColor: option.productColor,
  //         productStock: option.productStock
  //       });
  //     });
  //     return acc;
  //   }, []);
  // };
  
  // // 사용 예:
  // const response = await axios.get(`$${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//{process.env.REACT_APP_API_URL}product/all/store/${storeId}`, { ... });
  // const transformedData = transformData(response.data);
  // setRowData(transformedData);
// 세로 줄바꿈 코드 



  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "상품사진",
      field: "productUrls",
      headerClass: "center-header", // 각 컬럼에 headerClass 추가
      minWidth: 180,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      editable: false,
      cellRenderer: ImageCellRenderer,
    },
    {
      headerName: "상품명",
      field: "productName",
      headerClass: "center-header", // 각 컬럼에 headerClass 추가
      editable: false,
      minWidth: 180,
    },
    {
      headerName: "상품코드",
      field: "productId",
      headerClass: "center-header",
      editable: false,
      filter: true,
    },
    {
      headerName: "사이즈",
      field: "productSize",
      headerClass: "center-header",
      editable: false,
      filter: true,
      valueGetter: params => params.data.options ? params.data.options.map(option => option.productSize).join("\n") : ''
    
    
},
    {
      headerName: "색상",
      field: "productColor",
      headerClass: "center-header",
      editable: false,
      minWidth: 150,
      filter: true,
     valueGetter: params => params.data.options ? params.data.options.map(option => option.productColor).join("\n") : ''
},

    {
      headerName: "재고 수량",
    
      headerClass: "center-header",
      editable: false,
      filter: true,
      valueGetter: params => params.data.options ? params.data.options.map(option => option.productStock).join("\n") : ''
    },
    {
      headerName: "관리",
      headerClass: "center-header",

      editable: false,
      minWidth: 150,
      cellRenderer: (params) => {
        //const { storeId } = this.props; // storeId를 적절한 방법으로 가져옴
        const productId = params.data.productId; // productId를 params에서 추출

        return (
          <CellRenderer storeId={storeId} productId={productId} {...params} />
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

  const onCellEditingStopped = useCallback((event) => {
    console.log("cellEditingStopped");

    // 수정된 데이터 가져오기
    const updatedData = rowData;

    // rowData 상태 업데이트
    setRowData((prevRowData) => {
      // 기존 rowData에서 수정된 행 찾기
      const updatedRowData = prevRowData.map((row) => {
        if (row.id === updatedData.productId) {
          // id는 각 행을 식별할 수 있는 유니크한 값이어야 합니다.
          return updatedData; // 수정된 데이터로 행 업데이트
        } else {
          return row; // 다른 행들은 그대로 유지
        }
      });

      return updatedRowData;
    });
  }, []);

  const onBtSave = useCallback(() => {
    const allRowNodes = gridRef.current.api.getModel().rowsToDisplay;
    const allRowData = allRowNodes.map((node) => node.data);
    setSavedRowData(allRowData);
    console.log(allRowData); // 콘솔에 모든 행의 데이터를 출력
  }, []);
  const [newProduct, setNewProduct] = useState({
    productId: "",
    productUrls: [""],
  });

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
      `${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//${process.env.REACT_APP_API_URL}product/seller`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      }
    )
      .then((response) => {
        if (response.status == 200) {
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
              <button onClick={handleDelete}>삭제</button>
              <button
                onClick={() => {
                  createProduct();

                  //setRowData([...rowData,
                  //  {  productUrls: newProduct.productUrls[0] ,  productName: "",  productId: newProduct.productId,  productSize: "",  productColor: '',  productStock: '',}])
                }}
              >
                추가
              </button>
            </div>

            {/* <div>
            <button onClick={onBtSave}>저장</button>
          </div> */}
          </div>
          <div className="grid-wrapper">
            <div style={gridStyle} className="ag-theme-alpine">
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                getRowNodeId={getRowId}
                defaultColDef={defaultColDef}
                suppressRowClickSelection={true}
                rowSelection={"multiple"}
                rowHeight={100}
                frameworkComponents={{
                  imageCellRenderer: ImageCellRenderer, // 컴포넌트 등록
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
