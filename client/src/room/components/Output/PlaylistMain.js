import React from "react";

import "./Playlist.css";

const PlaylistMain = (props) => {
  return (
    <div
      className="toplay_img"
      id={props.i}
      style={{
        width: String((props.duration * 100) / 60) + "%",
        height: "auto",
        backgroundImage: `url(${props.url})`,
        backgroundSize: "contain",
        backgroundRepeat: "repeat-x",
      }}
      key={props.url}></div>
  );
};

export default PlaylistMain;
