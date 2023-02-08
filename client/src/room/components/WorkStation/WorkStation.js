import React, { useState } from "react";

import PhotoBox from "./PhotoBox";
import OpenedPhotoBox from "./OpenedPhotoBox";
import Canvas from "./Canvas";
import Effects from "./Effects";

import "./WorkStation.css";

const WorkStation = () => {
  const [photoBoxIsOpen, setPhotoBoxIsOpen] = useState(false);

  const openBoxHandler = () => {
    setPhotoBoxIsOpen(true);
  };

  const closeBoxHandler = () => {
    setPhotoBoxIsOpen(false);
  };

  return (
    <React.Fragment>
      <div className="ROOM-BODY-CANVAS">
        {photoBoxIsOpen ? (
          <OpenedPhotoBox closeBox={closeBoxHandler} />
        ) : (
          <PhotoBox openBox={openBoxHandler} />
        )}
        <Canvas />
        <Effects />
      </div>
    </React.Fragment>
  );
};

export default WorkStation;
