import React from "react";

import PhotoBox from "./PhotoBox";
import { TocanvasProvider } from "./Image_Up_Check_Del/ImageContext";
import Canvas from "./Canvas";
// import Effects from "./Effects";

import "./WorkStation.css";

const WorkStation = () => {
  return (
    <React.Fragment>
      <TocanvasProvider>
        <div className="ROOM-BODY-WorkStation">
          <PhotoBox />
          <Canvas />
          {/* <Effects /> */}
        </div>
      </TocanvasProvider>
    </React.Fragment>
  );
};

export default WorkStation;
