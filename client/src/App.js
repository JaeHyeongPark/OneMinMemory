import React, { useCallback, useState } from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";

import MainPage from "./MainScreen/M-MainPage";
import Room from "./room/pages/Room";
import AuthContext from "./shared/context/auth-context";

/* 아이디 연결시, 방 생성시 작업해야 할 부분
<Route path="/:userId/room" element={<Room/>}/>  */

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        <main width="100%">{routes}</main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
