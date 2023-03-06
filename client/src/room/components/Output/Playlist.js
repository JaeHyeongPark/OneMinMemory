import React, { useContext,useEffect } from "react";
import { useDrop } from "react-dnd";
import axios from "axios";
import { useParams } from "react-router-dom";

import "./Playlist.css";
import PlaylistContext from "../../../shared/context/playlist-context";
import PlaylistMain from "./PlaylistMain";
import PlaylistTrans from "./PlaylistTrans";
import App from "../../../App";
import { DraggingContext } from "../../pages/DraggingContext";
import SnackBar from "../RoomHeader/SnackBar";


const Playlist = () => {
  const playlistCtx = useContext(PlaylistContext);
  const roomId = useParams().roomId;
  // DraggingContext
  const { picDrag, effectDrag } = useContext(DraggingContext);

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
      SnackBar.playlistEditWarningOpen();
      return;
    }
    axios
      .post(process.env.REACT_APP_expressURL + "/output/inputnewplay", {
        url: url,
        roomid: roomId,
      })
      .then((res) => {
        if (res.data.success !== true) {
          console.log("응답에러");
        }
      });
  };

  // 재생목록 관련 API에 따른 소켓 전송
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
      playlistCtx.changemusicidx(data.idx);
      playlistCtx.addToPlaylist(data.playlist);
    });
  }, []);
  
  return (
    <div className="Tracks">
      <div
        className="playlist_main"
        style={{
          border: (picDrag || effectDrag) && "2px solid #1484CD",
          boxShadow:
            (picDrag || effectDrag) &&
            "0 0 2px #1484CD, 0 0 2px #1484CD, 0 0 20px #1484CD, 0 0 8px #1484CD, 0 0 28px #1484CD, inset 0 0 13px #1484CD",
        }}>
        {playlistCtx.playlist.map((data, i) => (
          <PlaylistMain
            effect={data.effect}
            duration={data.duration}
            url={data.url}
            select={data.select}
            i={i}
          />
        ))}
        <div className="VideoTrack" ref={newplayimg} />
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
