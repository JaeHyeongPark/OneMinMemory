import React, { useContext } from "react";
// 음악 파형 상태바
import PlaylistContext from "../../../shared/context/playlist-context";

const SoundTrack = () => {
  const playlistCtx = useContext(PlaylistContext);
  const idx = playlistCtx.musicidx;
  return <div className="soundtrack_layout">사운드트랙-{idx}</div>;
};

export default SoundTrack;
