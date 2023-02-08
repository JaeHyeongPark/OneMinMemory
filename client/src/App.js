import React from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";

import MainPage from "./MainScreen/M-MainPage";
import Room from "./room/pages/Room";

/* 아이디 연결시, 방 생성시 작업해야 할 부분
<Route path="/:userId/room" element={<Room/>}/>  */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<MainPage />} />
        <Route path="/room" element={<Room />} />
        <Route path="/*" element={<Navigate to={"/"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
