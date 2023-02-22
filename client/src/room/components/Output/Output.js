import React from "react";
import Playlist from "./Playlist";
import RenderButton from "./RenderButton";
import Scale from "./Scale";
import InsertMusic from "./InsertMusic";
import SoundTrack from "./SoundTrack";

import polaroid from "../../assets/polaroid.svg";
import "./Output.css";

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
          <div className="preview_button_group">
            <div className="preview_button">
              <img
                src={polaroid}
                className="img.polaroid"
                alt="video preview"
              />
              <label className="preview_label">미리보기</label>
            </div>
          </div>
          <RenderButton />
        </div>
      </div>
    </div>
  );
};

export default Output;
