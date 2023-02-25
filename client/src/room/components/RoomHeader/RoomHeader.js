import React from "react";
import { useNavigate } from "react-router-dom";
import RoomCode from "./RoomCode";
import useradd from "../../assets/user-add.svg";
import photologo from "../../assets/photo-512-white.png";
import "./RoomHeader.css";

const RoomHeader = (props) => {
  const navigate = useNavigate();
  const Go_to_the_Home = (e) => {
    e.preventDefault();
    navigate("/");
  };
  return (
    <div className="ROOM-HEADER">
      <div className="Container">
        <div className="Inner">
          <div className="min-roomname">
            <div className="logo_and_icon">
              <span
                className="title"
                onClick={Go_to_the_Home}
                style={{ cursor: "pointer" }}
              >
                일분추억
              </span>
              <div className="logoicon">
                <img src={photologo} className="photo-512-white-1" alt="a" />
              </div>
            </div>
          </div>
          <RoomCode />
          <div className="invite_layout">
            <div className="invite_button_group">
              <div className="invite_button">
                <img src={useradd} className="img.user-add" alt="a" />
                <label className="invite_label">링크공유</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomHeader;
