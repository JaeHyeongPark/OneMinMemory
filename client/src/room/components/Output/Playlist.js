import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import "./Playlist.css";
import PlaylistContext from "../../../shared/context/playlist-context";
import PlaylistMain from "./PlaylistMain";
import PlaylistTrans from "./PlaylistTrans";
import App from "../../../App";

const Playlist = () => {
  const playlistCtx = useContext(PlaylistContext);
  const roomId = useParams().roomId;

  // 프리셋 말고 빈 재생목록부분의 드랍존
  const [{ isover }, newplayimg] = useDrop(() => ({
    accept: ["image"],
    drop: (item) => inputnewplay(item.url),
    collect: (monitor) => ({
      isover: monitor.isOver(),
    }),
  }));

  // 새로운 사진을 재생목록에 추가(프리셋 말고)
  const inputnewplay = (url) => {
    if (App.playlistPermissionState !== 1) {
      return;
    }
    axios
      .post("http://localhost:5000/output/inputnewplay", {
        url: url,
        roomid: roomId,
      })
      .then((res) => {
        if (res.data.success != true) {
          console.log("응답에러");
        }
      });
  };
  useEffect(() => {
    App.mainSocket.on("playlistChangedBasic", (data) => {
      playlistCtx.addToPlaylist(data.playlist);
    });
    App.mainSocket.on("playlistChangeDelete", (data) => {
      playlistCtx.addToPlaylist(data.playlist);
      playlistCtx.changetime("");
      App.check = true;
    });
    App.mainSocket.on("playlistChangeClick", (data) => {
      playlistCtx.changeDT(data.duration);
      playlistCtx.changeTT(data.totaltime);
      playlistCtx.changeidx(data.idx);
      playlistCtx.addToPlaylist(data.playlist);
      playlistCtx.changetime(data.time);
    });
    App.mainSocket.on("playlistChangedTime", (data) => {
      playlistCtx.addToPlaylist(data.playlist);
      playlistCtx.changetime("");
      playlistCtx.changeDT(data.DT);
    });
    App.mainSocket.on("playlistpreset", (data) => {
      playlistCtx.selectmusicsrc(data.src);
      playlistCtx.addToPlaylist(data.playlist);
    });
  }, []);
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
