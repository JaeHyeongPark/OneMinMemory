import React from "react";

import PhotoBox from "./PhotoBox";
import { TocanvasProvider } from "./Image_Up_Check_Del/ImageContext";
import Canvas from "./Canvas";

import "./WorkStation.css";

const WorkStation = () => {
  return (
    <React.Fragment>
      <TocanvasProvider>
        <div className="ROOM-BODY-WorkStation">
          <PhotoBox />
          <Canvas />
        </div>
      </TocanvasProvider>
    </React.Fragment>
  );
};

export default WorkStation;
