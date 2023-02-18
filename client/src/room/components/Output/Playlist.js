import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";

import PlaylistContext from "../../../shared/context/playlist-context";
// import PlaylistShow from "./PlaylistShow";
import "./Playlist.css";
import PlaylistMain from "./PlaylistMain";
import PlaylistTrans from "./PlaylistTrans";

const Playlist = () => {
  const playlistCtx = useContext(PlaylistContext);

  return (
    <div className="playlist_layout">
      <div className="playlist_main">
        {playlistCtx.playlist.map((data, i) => (
          <PlaylistMain
            duration={data.duration}
            url={data.url}
            i={i}
          />
        ))}
      </div>
      <div className="playlist_transition">
        {playlistCtx.playlist.map((data, i) => (
          <PlaylistTrans
            duration={data.duration}
            transition={data.transition}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Playlist;
