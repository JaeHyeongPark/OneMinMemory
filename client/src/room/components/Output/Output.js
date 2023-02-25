import React from "react";
import Playlist from "./Playlist";
import RenderButton from "./RenderButton";
import Scale from "./Scale";
import InsertMusic from "./InsertMusic";
import SoundTrack from "./SoundTrack";

import "./Output.css";

import EditPermissionButton from "./EditPermissionButton";

const Output = () => {
  return (
    <div className="ROOM-FOOTER">
      <div className="ROOM-FOOTER-TEST">
        <div className="TimeandBar">
          <div className="time">
            <span className="start">00:00</span>
            <span className="end">01:00</span>
          </div>
          <div className="TimeBar">
            <Scale></Scale>
          </div>
        </div>
        <Playlist />
        <SoundTrack />
      </div>
      <div className="ROOM-FOOTER-BUTTONS">
        <div className="finished_layout">
          <InsertMusic />
          <RenderButton />
          <EditPermissionButton />
        </div>
      </div>
    </div>
  );
};

export default Output;
