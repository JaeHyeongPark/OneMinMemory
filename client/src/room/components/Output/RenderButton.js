import React, { useContext } from "react";
import PlaylistContext from "../../../shared/context/playlist-context";
import axios from "axios";
import FileDownload from "js-file-download";
import { useParams } from "react-router-dom";

import infinity from "../../assets/infinity.svg";

const RenderButton = () => {
  const playlistCtx = useContext(PlaylistContext);
  const roomId = useParams().roomId;

  const merge = () => {
    console.log("다운로드 버튼 클릭 !");
    console.log(playlistCtx.playlist);
    axios({
      method: "post",
      url: "http://localhost:5000/output/merge",
      responseType: "blob",
      data: {
        playlist: playlistCtx.playlist,
        roomid:roomId
      },
    }).then((res) => {
      FileDownload(res.data, `oneminute_${Date.now()}.mp4`);
    });
  };

  return (
    <div className="render_button_group">
      <button className="render_button" onClick={merge}>
        <img src={infinity} className="img.infinity" alt="video rendering" />
        <label className="render_label">렌더링</label>
      </button>
    </div>
  );
};

export default RenderButton;
