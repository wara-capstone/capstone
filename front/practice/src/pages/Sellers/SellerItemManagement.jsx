import "./Seller.css";
import SellerHeader from "./SellerHeader.jsx";


import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { useParams } from 'react-router-dom';
import ImageCellRenderer from '../../components/ImageCellRenderer';

import CellRenderer from "./CellRenderer.jsx";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from 'axios';


// SellerItemManagement 컴포넌트 정의
export default function SellerItemManagement() {
  const { storeId } = useParams();
  
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [savedRowData, setSavedRowData] = useState([]);
  const token = sessionStorage.getItem("token");
  const [productInfo, setProductInfo] = useState({ result: "", data: [] });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/product/all/store/22',
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${token}`
            }
          }
        );
        setRowData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("실패");
        console.error(error);
      }
    };
    fetchData();
  }, [token]);






  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "상품사진",
      field: "productUrls",
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
      editable: false,
      minWidth: 180,
      
    },
    { headerName: "상품코드", field: "productId", 
    editable: false,filter: true },
    { headerName: "사이즈", field: "options[0].productSize", 
    editable: false,filter: true,
      valueGetter: params => params.data.options[0].productSize },
    {
      headerName: "색상",
      field: "options[0].productColor",
      editable: false,
      minWidth: 150,
      filter: true,
      valueGetter: params => params.data.options[0].productColor 
    },
    { headerName: "재고 수량", field: "options[0].productStock", filter: true,
    editable: false,
      valueGetter: params => params.data.options[0].productStock },
    
    {
      headerName: '관리',
      editable: false,
      minWidth: 150, cellRenderer: 
      
      (params) => {
        //const { storeId } = this.props; // storeId를 적절한 방법으로 가져옴
          const productId = params.data.productId; // productId를 params에서 추출

        return <CellRenderer storeId={storeId} productId={productId} {...params} />;
      },
    }
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
  const allRowData = allRowNodes.map(node => node.data);
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
              onClick={() => {
                const selectedNodes = gridRef.current.api.getSelectedNodes();
                const selectedData = selectedNodes.map((node) => node.data);
                const newrowData = rowData.filter(
                  (row) => !selectedData.includes(row)
                );
                setRowData(newrowData);
              }}
            >
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
                cellRenderer: CellRenderer }}
            />
          </div>
        </div>

        </div>
      </div>
    
  );
}
