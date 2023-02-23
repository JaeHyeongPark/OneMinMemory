import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import axios from "axios";
import { useParams } from "react-router-dom";

import "./Playlist.css";
import PlaylistContext from "../../../shared/context/playlist-context";
import PlaylistMain from "./PlaylistMain";
import PlaylistTrans from "./PlaylistTrans";

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
    axios
      .post("http://localhost:5000/output/inputnewplay", {
        url: url,
        roomid: roomId,
      })
      .then((res) => {
        console.log(res.data);
        playlistCtx.addToPlaylist(res.data);
      });
  };

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
