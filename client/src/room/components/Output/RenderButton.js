import React, { useContext } from "react";
import PlaylistContext from "../../../shared/context/playlist-context";
import axios from "axios";
import FileDownload from "js-file-download";

import infinity from "../../assets/infinity.svg";

const RenderButton = () => {
  const playlistCtx = useContext(PlaylistContext);

  const merge = () => {
    console.log("다운로드 버튼 클릭 !");
    console.log(playlistCtx.playlist);
    axios({
      method: "post",
      url: "https://chjungle.shop/api/output/merge",
      responseType: "blob",
      data: {
        playlist: playlistCtx.playlist,
        translist: playlistCtx.translist,
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
