import React from "react";
import BottomNav from "../components/BottomNav";
import ClothFeedList from "../components/ClothFeedList";
import Header from "../components/Header";

export default function Feed() {
  return (
    <div className="feed">
      <Header />

      {/* <Box component="section" sx={{gridColumn: '1/3'}}>
      <ClothFeedList />
      </Box> */}
      <div className="ClothFeedList-in-feed">
        <ClothFeedList />
      </div>

      <BottomNav />
    </div>
  );
}
