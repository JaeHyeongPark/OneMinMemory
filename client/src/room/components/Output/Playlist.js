import React, { useContext } from "react";
// import axios from "axios";

import PlaylistContext from "../../../shared/context/playlist-context";
// import PlaylistShow from "./PlaylistShow";
import "./Playlist.css";

const Playlist = () => {
  const playlistCtx = useContext(PlaylistContext);
  const playlistView = playlistCtx.playlist;

  const context = Object.keys(playlistView).map((url) => {
    if (playlistView[url] === 0) {
      return (
        <img
          className="toplay_img"
          key={url}
          src={url}
          alt="a"
        />
      );
    } else {
      return (
        <img
          className="toplay_select_img"
          key={url}
          src={url}
          alt="a"
        />
      );
    }
  });

  return <div className="playlist_layout">{context}</div>;
};

export default Playlist;
