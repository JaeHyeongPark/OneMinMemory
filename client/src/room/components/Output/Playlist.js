import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import axios from "axios";
import App from "../../../App";

import PlaylistContext from "../../../shared/context/playlist-context";
import "./Playlist.css";
import PlaylistMain from "./PlaylistMain";
import PlaylistTrans from "./PlaylistTrans";

const Playlist = () => {
  const playlistCtx = useContext(PlaylistContext);
  const [{ isover }, newplayimg] = useDrop(() => ({
    accept: ["image"],
    drop: (item) => inputnewplay(item.url),
    collect: (monitor) => ({
      isover: monitor.isOver(),
    }),
  }));

  const inputnewplay = (url) => {
    if (App.playlistPermissionState != 1) {
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

  return (
    <div className="playlist_layout">
      <div className="playlist_main">
        {playlistCtx.playlist.map((data, i) => (
          <PlaylistMain
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
