import React, { useCallback, useState } from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";

import MainPage from "./MainScreen/M-MainPage";
import Room from "./room/pages/Room";
import AuthContext from "./shared/context/auth-context";

import { io } from "socket.io-client";

const mainSocket = io("http://localhost:5000", {
  path: "/mainsocket",
  withCredentials: true,
});

/* 아이디 연결시, 방 생성시 작업해야 할 부분
<Route path="/:userId/room" element={<Room/>}/>  */

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(1);
  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/room" element={<Room />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<MainPage />} />
        <Route path="/room" element={<Room />} />
        <Route path="/room/:roomcode" element={<Room />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      <BrowserRouter>
        <main>{routes}</main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

// 소캣 객체
App.mainSocket = mainSocket;
// playlist의 상태 0:사용 가능 1:내가 사용중, 2: 누가 사용중
App.playlistPermissionState = 0;

export default App;
