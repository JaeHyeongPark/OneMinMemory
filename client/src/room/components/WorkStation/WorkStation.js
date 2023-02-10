import React, { useState } from "react";

import PhotoBox from "./PhotoBox";
import Canvas from "./Canvas";
import Effects from "./Effects";

import "./WorkStation.css";

const WorkStation = () => {
  return (
    <React.Fragment>
      <div className="ROOM-BODY-WorkStation">
        <PhotoBox />
        <Canvas />
        {/* <Effects /> */}
      </div>
    </React.Fragment>
  );
};

export default WorkStation;
