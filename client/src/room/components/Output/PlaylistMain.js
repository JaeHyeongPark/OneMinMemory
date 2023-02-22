import React from "react";
import axios from "axios";
import { useDrop } from "react-dnd";
import { useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import PlaylistContext from "../../../shared/context/playlist-context";

import "./Playlist.css";

const PlaylistMain = (props) => {
  const playlistCtx = useContext(PlaylistContext);
  const AuthCtx = useContext(AuthContext);
  // const effect = playlistCtx.playlist[props.idx].effect;

  // 삭제 딜레이 커버 체크(상태) 변수
  let check = true;
  const [{ isover }, playlist] = useDrop(() => ({
    accept: ["image", "effect"],
    drop: (item) => {
      if (item.type === "image") {
        sendTourl(item.url);
      } else {
        sendToeffect(item.className);
      }
    },
    collect: (monitor) => ({
      isover: monitor.isOver(),
    }),
  }));
  // 이미지 드랍으로 이미지를 재생목록에 추가
  const sendTourl = (url) => {
    axios
      .post("http://localhost:5000/output/postplaylist", {
        url: url,
        idx: props.i,
        roomid: AuthCtx.rooomId,
      })
      .then((res) => {
        playlistCtx.addToPlaylist(res.data);
      });
  };
  // 클릭후 삭제 버튼
  const deleteimg = (e) => {
    e.preventDefault();
    check = false;
    axios
      .post("http://localhost:5000/output/deleteplayurl", {
        idx: props.i,
        roomid: AuthCtx.rooomId,
      })
      .then((res) => {
        playlistCtx.addToPlaylist(res.data);
        playlistCtx.changetime("");
        check = true;
      });
  };
  // 재생목록 사진 클릭시 상황에 맞게 이벤트
  const Clickimg = (e) => {
    e.preventDefault();
    if (!check) return;
    axios
      .post("http://localhost:5000/output/clickimg", {
        idx: props.i,
        roomid: AuthCtx.rooomId,
      })
      .then((res) => {
        playlistCtx.changeDT(res.data.duration);
        playlistCtx.changeTT(res.data.totaltime);
        playlistCtx.changeidx(props.i);
        playlistCtx.addToPlaylist(res.data.playlist);
        playlistCtx.changetime(res.data.time);
      });
  };

  const sendToeffect = (effect) => {
    axios
      .post("http://localhost:5000/output/effect", {
        effect,
        idx: props.i,
        roomid: AuthCtx.rooomId,
      })
      .then((res) => playlistCtx.addToPlaylist(res.data));
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
        <button className="del" onClick={deleteimg}>
          X
        </button>
      )}
    </div>
  );
};

export default PlaylistMain;
