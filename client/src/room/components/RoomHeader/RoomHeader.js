import React from "react";

import RoomCode from "./RoomCode";
import useradd from "../../assets/user-add.svg";
import photologo from "../../assets/photo-512-white.png";
import "./RoomHeader.css";

const RoomHeader = (props) => {
  return (
    <div className="ROOM-HEADER">
      <div className="Container">
        <div className="Inner">
          <div className="min-roomname">
            <div className="logo_and_icon">
              <span className="title">일분추억</span>
              <div className="logoicon">
                <img src={photologo} className="photo-512-white-1" />
              </div>
            </div>
            <span className="slash">/</span>
            <RoomCode />
          </div>
          <div className="invite_layout">
            <div className="invite_button_group">
              <div className="invite_button">
                <img src={useradd} className="img.user-add" />
                <label className="invite_label">초대하기</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomHeader;
