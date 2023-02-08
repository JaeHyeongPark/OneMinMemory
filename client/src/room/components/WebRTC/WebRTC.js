import React from "react";

import cans from "../../assets/cans.svg";

import "./WebRTC.css";

const WebRTC = () => {
  return (
    <div className="ROOM-BODY-WebRTC">
      <div className="CAMs">
        <div className="CamFrame">
          <img src={cans} className="img.component-cans" />
          <div className="Name">
            <span className="NAME">Name</span>
          </div>
        </div>
        <div className="CamFrame">
          <img src={cans} className="img.component-cans" />
          <div className="Name">
            <span className="NAME">Name</span>
          </div>
        </div>
        <div className="CamFrame">
          <img src={cans} className="img.component-cans" />
          <div className="Name">
            <span className="NAME">Name</span>
          </div>
        </div>
        <div className="CamFrame">
          <img src={cans} className="img.component-cans" />
          <div className="Name">
            <span className="NAME">Name</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebRTC;
