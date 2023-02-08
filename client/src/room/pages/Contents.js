import React from "react";

import WorkStation from "../components/WorkStation/WorkStation";
import WebRTC from "../components/WebRTC/WebRTC";
import Output from "../components/Output/Output";

import "./Contents.css";

const Contents = () => {
  return (
    <React.Fragment>
      <div className="ROOM-BODY">
        <WorkStation />
        <WebRTC />
      </div>
      <Output />
    </React.Fragment>
  );
};

export default Contents;
