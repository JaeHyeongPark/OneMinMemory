import React, { useState } from "react";

import PhotoBox from "./PhotoBox";
import Canvas from "./Canvas";

import "./WorkStation.css";

const WorkStation = () => {
  return (
    <React.Fragment>
      <div className="ROOM-BODY-WorkStation">
        <PhotoBox />
        <Canvas />
      </div>
    </React.Fragment>
  );
};

export default WorkStation;
