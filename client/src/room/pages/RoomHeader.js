import React from "react";

import useradd from "../assets/user-add.svg";
import photologo from "../assets/photo-512-white.png";
import "./RoomHeader.css";

const RoomHeader = () => {
  return (
    <div className="ROOM-HEADER">
      <div className="Container">
        <div className="Inner">
          <div className="min-roomname">
            <div className="LogoIcon">
              <span className="min">일분추억</span>
              <div className="min-logoIcon">
                <img src={photologo} className="photo-512-white-1" />
              </div>
            </div>
            <span className="slash">/</span>
            <span className="XXXX">XXXX</span>
          </div>
          <div className="min-invite">
            <div className="min-ButtonGroup">
              <div className="min-Button">
                <img src={useradd} className="user-add" />
                <label className="invitelabel">초대하기</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomHeader;
