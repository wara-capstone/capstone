import React from "react";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import ClothFeedList from "../components/ClothFeedList";
import Box from '@mui/material/Box';

export default function Feed() {
  return (
    <div className="feed">
      <Header />

     

    {/* <Box component="section" sx={{gridColumn: '1/3'}}>
      <ClothFeedList />
      </Box> */}
    <ClothFeedList />

      <BottomNav />
    </div>
  );
}
