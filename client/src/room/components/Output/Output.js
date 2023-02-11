import React from "react";

import playbuttono from "../../assets/playbuttono.svg";
import polaroid from "../../assets/polaroid.svg";
import infinity from "../../assets/infinity.svg";

import "./Output.css";

const Output = () => {
  return (
    <div className="ROOM-FOOTER">
      <div className="ROOM-FOOTER-TEST">
        <div className="playlist_layout"></div>
        <div className="insert_music_button">
          <div className="insert_music_icon">
            <img src={playbuttono} alt="insert music" />
          </div>
          <span className="music_span">음악넣기</span>
        </div>
      </div>
      <div className="ROOM-FOOTER-BUTTONS">
        <div className="finished_layout">
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
          <div className="render_button_group">
            <div className="render_button">
              <img
                src={infinity}
                className="img.infinity"
                alt="video rendering"
              />
              <label className="render_label">렌더링</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Output;
