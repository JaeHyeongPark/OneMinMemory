import React, { useContext } from "react";
import axios from "axios";

import ImageContext from "../WorkStation/Image_Up_Check_Del/ImageContext";
import PlaylistContext from "../../../shared/context/playlist-context";
import playbutton from "../../assets/playbutton.svg";

import "./ToplaylistButton.css";

const ToPlaylistButton = (props) => {
  const ToCanvas = useContext(ImageContext);
  const playlistCtx = useContext(PlaylistContext);

  const addToPlay = async () => {
    const imagedata = await props.canvasRef.current.toDataURL(
      "image/" + ToCanvas.type
    );
    const formdata = new FormData();
    formdata.append("imagedata", imagedata);
    formdata.append("originurl", ToCanvas.url);
    await axios
      .post("https://chjungle.shop/api/output/addtoplay", formdata, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        playlistCtx.addToPlaylist(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <button className="toPlaylist" onClick={addToPlay}>
      <div className="play-button-o">
        <img src={playbutton} alt="playbutton" />
      </div>
      <span className="playlist_label">재생목록에 담기</span>
    </button>
  );
};

export default ToPlaylistButton;
