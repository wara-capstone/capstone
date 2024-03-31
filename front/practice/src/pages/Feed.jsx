import React from "react";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";

export default function Feed() {
  return (
    <div className="feed">
      <Header />

      <h2>준비 중인 서비스입니다.</h2>

      <BottomNav />
    </div>
  );
}
