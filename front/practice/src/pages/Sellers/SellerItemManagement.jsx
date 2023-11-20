import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Seller.css";
import SellerHeader from "./SellerHeader.jsx";
//import SellerItem from "./SellerItem";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { getData } from "./data.js";
import CellRenderer from "./CellRenderer.jsx";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";


export default function SellerItemManagement() {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [savedRowData, setSavedRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "상품사진",
      field: "productUrls",
      minWidth: 180,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      cellRenderer: 'imageCellRenderer',
    },
    {
      headerName: "상품명",
      field: "productName",
      minWidth: 180,
      
    },
    { headerName: "상품코드", field: "productId", filter: true },
    { headerName: "사이즈", field: "options.productSize", filter: true },
    {
      headerName: "입고 수량",
      field: "incomingQuantity",
      minWidth: 150,
      filter: true,
    },
    { headerName: "출고 수량", field: "outgoingQuantity", filter: true },
    { headerName: "입고액(원)", field: "incomingAmount", filter: true },
    { headerName: "출고액(원)", field: "outgoingAmount", filter: true },
    { headerName: "메모", field: "note", filter: true },
    {
      headerName: '관리',
      minWidth: 175, cellRenderer: CellRenderer
    }
  ]);

  const token = sessionStorage.getItem("token");


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

  const onRowEditingStarted = useCallback((event) => {
    console.log("never called - not doing row editing");
  }, []);

  const onRowEditingStopped = useCallback((event) => {
    console.log("never called - not doing row editing");
  }, []);

  const onCellEditingStarted = useCallback((event) => {
    console.log("cellEditingStarted");
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



  const onBtStopEditing = useCallback(() => {
    gridRef.current.api.stopEditing();
  }, []);

  const onBtStartEditing = useCallback((key, pinned) => {
    gridRef.current.api.setFocusedCell(0, "firstName", pinned);
    gridRef.current.api.startEditingCell({
      rowIndex: 0,
      colKey: "firstName",
      // set to 'top', 'bottom' or undefined
      rowPinned: pinned,
      key: key,
    });
  }, []);

  const onBtNextCell = useCallback(() => {
    gridRef.current.api.tabToNextCell();
  }, []);

  const onBtPreviousCell = useCallback(() => {
    gridRef.current.api.tabToPreviousCell();
  }, []);

  const onBtSave = useCallback(() => {
  const allRowNodes = gridRef.current.api.getModel().rowsToDisplay;
  const allRowData = allRowNodes.map(node => node.data);
  setSavedRowData(allRowData); 
  console.log(allRowData); // 콘솔에 모든 행의 데이터를 출력
  }, []);

  useEffect( () => {
    const fetchData = async () => {
    const response = await fetch(
      'https://port-0-gateway-12fhqa2llofoaeip.sel5.cloudtype.app/product/all/store/22',
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        },
      }
    );
    const result = await response.json();
    if (response.status === 200) {
      setRowData(result);
      console.log(result);

    } else {
      console.log("실패");
    }
  };
  fetchData();
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
            {/* <button onClick={() => onBtStartEditing("T")}>edit (0, 'T')</button>
            <button onClick={() => onBtStartEditing(undefined, "top")}>
              edit (0, Top)
            </button>
            <button onClick={() => onBtStartEditing(undefined, "bottom")}>
              edit (0, Bottom)
            </button> */}
          </div>
          <div>
            {/* <button onClick={onBtStopEditing}>stop ()</button>
            <button onClick={onBtNextCell}>next ()</button>
            <button onClick={onBtPreviousCell}>previous ()</button> */}
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
              // onRowEditingStarted={onRowEditingStarted}
              // onRowEditingStopped={onRowEditingStopped}
              // onCellEditingStarted={onCellEditingStarted}
              // onCellEditingStopped={onCellEditingStopped}
              frameworkComponents={{ cellRenderer: CellRenderer }}
            />
          </div>
        </div>
        {/* <div className="item-add-icon"> */}
          {/* <FontAwesomeIcon icon={faPlus} /> */}
        </div>
      </div>
    
  );
}
