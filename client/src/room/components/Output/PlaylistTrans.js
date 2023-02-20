import React, { useContext } from "react";
import PlaylistContext from "../../../shared/context/playlist-context";
import TransitionButton from "./TransitionButton";
import "./Playlist.css";

const PlaylistTrans = (props) => {
  const playlistCtx = useContext(PlaylistContext);
  const playlistView = playlistCtx.playlist;

  return (
    <>
      {props.i === 0 ? (
        <>
          <div
            className="toplay_block"
            id={props.i}
            style={{
              width: String(((props.duration - 0.5) * 100) / 60) + "%",
            }}
          />
          {<TransitionButton className="toplay_trans" idx={props.i}/>}
        </>
      ) : props.i < playlistView.length - 1 ? (
        <>
          <div
            className="toplay_block"
            id={props.i}
            style={{
              width: String(((props.duration - 1) * 100) / 60) + "%",
            }}
          />
          <TransitionButton className="toplay_trans" idx={props.i}/>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default PlaylistTrans;
