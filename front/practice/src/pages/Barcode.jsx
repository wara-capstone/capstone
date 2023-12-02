import React, { useState, useEffect, useRef, useMemo } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

import BarcodeReader from "../components/BarcodeReader";
export default function Barcode() {
  
  return (
    <div className="barcode">
      <Header />
            <BarcodeReader/>
      <BottomNav />
    </div>
  );
}
