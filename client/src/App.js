import React from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import AuthContextProvider from "./shared/context/auth-context";
import MainPage from "./MainScreen/M-MainPage";
import Room from "./room/pages/Room";
import AuthContext from "./shared/context/auth-context";
import { io } from "socket.io-client";

/* 아이디 연결시, 방 생성시 작업해야 할 부분
<Route path="/:userId/room" element={<Room/>}/>  */

function App() {
  const mainSocket = io("https://chjungle.shop", {
    path: "/mainsocket",
    withCredentials: true,
  });
  App.mainSocket = mainSocket;
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

export default App;
