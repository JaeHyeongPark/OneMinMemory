import React, { useContext } from "react";
// import axios from "axios";

import PlaylistContext from "../../../shared/context/playlist-context";
// import PlaylistShow from "./PlaylistShow";
import "./Playlist.css";
import PlaylistMain from "./PlaylistMain";
import PlaylistTrans from "./PlaylistTrans";

const Playlist = () => {
  const playlistCtx = useContext(PlaylistContext);
  const playlistView = playlistCtx.playlist;

  return (
    <div className="playlist_layout">
      <div className="playlist_main">
        {playlistView.map((data, i) => (
          <PlaylistMain
            duration={data.duration}
            url={data.url}
            i={i}></PlaylistMain>
        ))}
      </div>
      <div className="playlist_transition">
        {playlistView.map((data, i) => (
          <PlaylistTrans
            duration={data.duration}
            transition={data.transition}
            i={i}></PlaylistTrans>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
