import React, { useContext } from "react";
// import axios from "axios";

import PlaylistContext from "../../../shared/context/playlist-context";
// import PlaylistShow from "./PlaylistShow";
import "./Playlist.css";

const Playlist = () => {
  const playlistCtx = useContext(PlaylistContext);
  const playlistView = playlistCtx.playlist;

  const context = playlistView.map((data, i) => {
    return (
      <>
        <div
          className="toplay_img"
          id={i}
          style={{
            width: String(((data.duration - 1) * 100) / 60) + "%",
            height: "auto",
            backgroundImage: `url(${data.url})`,
            backgroundSize: "contain",
            backgroundRepeat: "repeat-x",
          }}
          key={data.url}></div>
        <div
          className="toplay_img"
          id={i}
          style={{
            width: String((1 * 100) / 60) + "%",
            height: "auto",
            backgroundImage: `url(https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)`,
            backgroundSize: "contain",
            backgroundRepeat: "repeat-x",
          }}
          key={data.url}></div>
      </>
    );
  });

  return <div className="playlist_layout">{context}</div>;
};

export default Playlist;
