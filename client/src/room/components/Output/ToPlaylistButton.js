import React from "react";

import playbutton from "../../assets/playbutton.svg";

const ToPlaylistButton = () => {
  return (
    <div className="toPlaylist">
      <div className="play-button-o">
        <img src={playbutton} alt="playbutton" />
      </div>
      <span className="playlist_label">재생목록에 담기</span>
    </div>
  );
};

export default ToPlaylistButton;
