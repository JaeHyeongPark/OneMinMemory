import MainPage from "./MainScreen/M-MainPage";
import React from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/login" element={<MainPage/>}/>
        <Route path="/workspace" element={<MainPage/>}/>
        <Route path="/*" element={<Navigate to={"/"} />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
