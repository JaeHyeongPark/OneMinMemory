import React from "react";

import playbuttono from "../../assets/playbuttono.svg";
import polaroid from "../../assets/polaroid.svg";
import infinity from "../../assets/infinity.svg";

import "./Output.css";

const Output = () => {
  return (
    <div className="ROOM-FOOTER">
      <div className="ROOM-FOOTER-TEST">
        <div className="FinishedPhoto"></div>
        <div className="Preview">
          <div className="play-button-o">
            <img src={playbuttono} />
          </div>
          <span className="musicspan">음악넣기</span>
        </div>
      </div>
      <div className="ROOM-FOOTER-BUTTONS">
        <div className="Buttons">
          <div className="min-ButtonGroup1">
            <div className="min-Button1">
              <img src={polaroid} className="img.polaroid" />
              <label className="prelabel">미리보기</label>
            </div>
          </div>
          <div className="min-ButtonGroup3">
            <div className="min-Button3">
              <img src={infinity} className="img.infinity" />
              <label className="renlabel">렌더링</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Output;
