import React from "react";
import axios from "axios";
import { useDrop } from "react-dnd";
import { useContext } from "react";
import PlaylistContext from "../../../shared/context/playlist-context";

import "./Playlist.css";

const PlaylistMain = (props) => {
  const playlistCtx = useContext(PlaylistContext);
  // 삭제 딜레이 커버 체크(상태) 변수
  let check = true;
  const [{ isover }, playlist] = useDrop(() => ({
    accept: ["image"],
    drop: (item) => sendTourl(item.url),
    collect: (monitor) => ({
      isover: monitor.isOver(),
    }),
  }));

  const sendTourl = (url) => {
    axios
      .post("http://localhost:5000/output/postplaylist", {
        url: url,
        idx: props.i,
      })
      .then((res) => {
        console.log(res.data);
        playlistCtx.addToPlaylist(res.data);
      });
  };

  const deleteimg = (e) => {
    e.preventDefault();
    check = false;
    axios
      .post("http://localhost:5000/output/deleteplayurl", {
        idx: props.i,
      })
      .then((res) => {
        playlistCtx.addToPlaylist(res.data);
        check = true;
      });
  };
  const Clickimg = (e) => {
    e.preventDefault();
    if (props.url === "" || !check) return;
    axios
      .post("http://localhost:5000/output/clickimg", {
        idx: props.i,
      })
      .then((res) => {
        playlistCtx.addToPlaylist(res.data);
      });
  };

  return (
    <div
      ref={playlist}
      className={props.select ? "selecttoplay_img" : "toplay_img"}
      id={props.i}
      style={{
        width: String((props.duration * 100) / 60) + "%",
        height: "auto",
        backgroundImage: `url(${props.url})`,
        backgroundSize: "contain",
        backgroundRepeat: "repeat-x",
      }}
      key={props.url}
      onClick={Clickimg}
    >
      {props.url && props.select && (
        <>
          {/* <button className="minus" onClick={deleteimg}>-</button> */}
          <button className="del" onClick={deleteimg}>
            X
          </button>
          {/* <button className="plus" onClick={deleteimg}>+</button> */}
        </>
      )}
    </div>
  );
};

export default PlaylistMain;
