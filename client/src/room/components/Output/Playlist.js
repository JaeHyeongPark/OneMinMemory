import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import axios from "axios";
import App from "../../../App";

import PlaylistContext from "../../../shared/context/playlist-context";
import { AuthContext } from "../../../shared/context/auth-context";
import "./Playlist.css";
import { useEffect } from "react";

import PlaylistMain from "./PlaylistMain";
import PlaylistTrans from "./PlaylistTrans";

const Playlist = () => {
  const playlistCtx = useContext(PlaylistContext);
  const AuthCtx = useContext(AuthContext);
  const [{ isover }, newplayimg] = useDrop(() => ({
    accept: ["image"],
    drop: (item) => inputnewplay(item.url),
    collect: (monitor) => ({
      isover: monitor.isOver(),
    }),
  }));
  // 다른사람이 playlist를 수정했을 때 동기화를 위한 소캣이벤트 추가
  useEffect(() => {
    console.log(1111111111111111111111111111);
    // 그냥 playlist만 입력하면 수정사항이 적용되는 경우
    // 이미지 삭제, 추가, 효과 추가, 삭제
    App.mainSocket.on("playlistChanged", (data) => {
      playlistCtx.addToPlaylist(data.playlist);
      playlistCtx.changetime("");
      App.check = true;
    });
    // 이미지 클릭 핸들링
    App.mainSocket.on("clicking", (data) => {
      playlistCtx.changeDT(data.duration);
      playlistCtx.changeTT(data.totaltime);
      playlistCtx.changeidx(data.idx);
      playlistCtx.addToPlaylist(data.playlist);
      playlistCtx.changetime(data.time);
    });
    App.mainSocket.on("changetime", (data) => {
      playlistCtx.addToPlaylist(data.playlist);
      playlistCtx.changetime("");
      playlistCtx.changeDT(data.DT);
    });
  }, []);

  const inputnewplay = (url) => {
    if (App.playlistPermissionState != 1) {
      console.log("여기");
      return;
    }
    // axios
    //   .post("https://chjungle.shop/output/inputnewplay", {
    //     url: url,
    //   })
    //   .then((res) => {
    //     playlistCtx.addToPlaylist(res.data);
    //   });
    App.mainSocket.emit("inputnewplay", {
      url,
      Id: App.mainSocket.id,
      roomId: App.roomId,
    });
  };
  console.log(22222222222);
  return (
    <div className="playlist_layout">
      <div className="playlist_main">
        {playlistCtx.playlist.map((data, i) => (
          <PlaylistMain
            effect={data.effect}
            duration={data.duration}
            url={data.url}
            select={data.select}
            i={i}
          />
        ))}
        <div className="playlist_space" ref={newplayimg} />
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
