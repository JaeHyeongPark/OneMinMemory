import React from "react";

import cans from "../../assets/cans.svg";

import "./WebRTC.css";

const WebRTC = () => {
  return (
    <div className="ROOM-BODY-WebRTC">
      <div className="CAMs">
        <div className="CamFrame">
          <img src={cans} className="img.component-cans" alt="a"/>
          <div className="name_layout">
            <span className="name_span">Name</span>
          </div>
        </div>
        <div className="CamFrame">
          <img src={cans} className="img.component-cans" alt="a"/>
          <div className="name_layout">
            <span className="name_span">Name</span>
          </div>
        </div>
        <div className="CamFrame">
          <img src={cans} className="img.component-cans" alt="a"/>
          <div className="name_layout">
            <span className="name_span">Name</span>
          </div>
        </div>
        <div className="CamFrame">
          <img src={cans} className="img.component-cans" alt="a"/>
          <div className="name_layout">
            <span className="name_span">Name</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebRTC;
