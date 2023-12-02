import "./Seller.css";
import SellerHeader from "./SellerHeader.jsx";

import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { useParams } from "react-router-dom";
import ImageCellRenderer from "../../components/ImageCellRenderer";

import CellRenderer from "./CellRenderer.jsx";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";

// SellerItemManagement 컴포넌트 정의
export default function SellerItemManagement() {
  const { storeId } = useParams();

  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [savedRowData, setSavedRowData] = useState([]);
  const token = localStorage.getItem("token");
  const [productInfo, setProductInfo] = useState({ result: "", data: [] });

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "/api/product/all/store/22",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      // 데이터 변형
      const transformedData = response.data.flatMap((item) =>
        item.options.map((option) => ({
          ...item,
          productSize: option.productSize,
          productColor: option.productColor,
          productStock: option.productStock,
        }))
      );

      setRowData(transformedData);
      //setRowData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("실패");
      console.error(error);
    }
  }, [token]);

  // 삭제 버튼의 onClick 핸들러
  const handleDelete = async () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);

    for (let item of selectedData) {
      try {
        const response = await axios.delete(
          `/api/product/seller/${storeId}/${item.productId}`,
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
  }, [fetchData]);


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
    },
    // valueGetter: params => params.productSize },
    //valueGetter: params => params.data.options[0].productSize }, //갑자기 이 부분이 안됨
    {
      headerName: "색상",
      field: "productColor",
      headerClass: "center-header",
      editable: false,
      minWidth: 150,
      filter: true,
      // valueGetter: params => params.data.options.map(option => option.productColor).join(', ') },
    },

    {
      headerName: "재고 수량",
      field: "productStock",
      headerClass: "center-header",
      editable: false,
      filter: true,
      // valueGetter: params => params.data.options.map(option => option.productStock).join(', ')},
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

  const [rowData, setRowData] = useState();

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
              onClick={handleDelete}>
              삭제
            </button>
            <button onClick={() => setRowData([...rowData, {}])}>추가</button>
          </div>

          <div>
            <button onClick={onBtSave}>저장</button>
          </div>
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
