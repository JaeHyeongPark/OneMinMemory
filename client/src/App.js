import React from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import AuthContextProvider from "./shared/context/auth-context";
import MainPage from "./MainScreen/M-MainPage";
import Room from "./room/pages/Room";

import { io } from "socket.io-client";
// require("dotenv").config();

const mainSocket = io(process.env.REACT_APP_expressURL, {
  path: "/mainsocket",
  withCredentials: true,
});
App.mainSocket = mainSocket;
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
// playlist의 상태 0:사용 가능 1:내가 사용중, 2: 누가 사용중
App.playlistPermissionState = 0;
// playlist 삭제 딜레이 커버 체크(상태) 변수
App.check = true;

export default App;
