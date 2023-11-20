import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Seller.css";
import SellerHeader from "./SellerHeader.jsx";
//import SellerItem from "./SellerItem";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { getData } from "./data.js";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";



export default function SellerInventoryManagement() {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [savedRowData, setSavedRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "상품사진",
      field: "productImg",
      minWidth: 180,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
    },
    {
      headerName: "상품명",
      field: "productName",
      minWidth: 180,
      
    },
    { headerName: "상품코드", field: "productCode", filter: true },
    { headerName: "사이즈", field: "productSize", filter: true },
    {
      headerName: "입고 수량",
      field: "incomingQuantity",
      minWidth: 150,
      filter: true,
    },
    { headerName: "출고 수량", field: "outgoingQuantity", filter: true },
    { headerName: "입고액(원)", field: "incomingAmouont", filter: true },
    { headerName: "출고액(원)", field: "outgoingAmount", filter: true },
    { headerName: "메모", field: "note", filter: true },
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
    const updatedData = event.data;

    // rowData 상태 업데이트
    setRowData((prevRowData) => {
      // 기존 rowData에서 수정된 행 찾기
      const updatedRowData = prevRowData.map((row) => {
        if (row.id === updatedData.id) {
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
    console.log(rowData); // 콘솔에 모든 행의 데이터를 출력
  }, [rowData]); // 의존성 배열에 rowData를 추가합니다.

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
              //pinnedTopRowData={pinnedTopRowData}
              //pinnedBottomRowData={pinnedBottomRowData}
              // onRowEditingStarted={onRowEditingStarted}
              // onRowEditingStopped={onRowEditingStopped}
              // onCellEditingStarted={onCellEditingStarted}
              // onCellEditingStopped={onCellEditingStopped}
            />
          </div>
        </div>
        {/* <div className="item-add-icon"> */}
          {/* <FontAwesomeIcon icon={faPlus} /> */}
        </div>
      </div>
   
  );
}
