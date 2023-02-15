import React, {useContext} from "react";
import PlaylistContext from "../../../shared/context/playlist-context";
import axios from "axios";

import infinity from "../../assets/infinity.svg";

const RenderButton = () => {
  const playlistCtx = useContext(PlaylistContext)

  const merge = () => {
    axios.post("http://localhost:5000/output/merge", {urlList:playlistCtx.playlist}).then((res) => {
      console.log(res);
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
