import React from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import AuthContextProvider from "./shared/context/auth-context";
import MainPage from "./MainScreen/M-MainPage";
import Room from "./room/pages/Room";

/* 아이디 연결시, 방 생성시 작업해야 할 부분
<Route path="/:userId/room" element={<Room/>}/>  */

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
