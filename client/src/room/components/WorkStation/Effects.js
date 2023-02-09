import React from "react";

import brush from "../../assets/brush.svg";
import arrowdowno from "../../assets/arrow-down-o.svg";
import "./Effects.css";

const Effects = () => {
  return (
    <div className="effectbox_group">
      <div className="effects">
        <div className="effect">
          <img src={brush} className="brush" />
        </div>
        <div className="effect">
          <img src={brush} className="brush" />
        </div>
        <div className="effect">
          <img src={brush} className="brush" />
        </div>
      </div>
      <div className="to_playlist_layout">
        <div className="to_playlist_button_group">
          <div className="to_playlist_button">
            <img src={arrowdowno} className="img.arrow-down-o" />
            <label className="to_playlist_label">재생 목록으로 이동</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Effects;
