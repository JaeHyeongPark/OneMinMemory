import React, { useContext } from "react";
// import axios from "axios";

// import ImageContext from "../WorkStation/Image_Up_Check_Del/ImageContext";
import playbutton from "../../assets/playbutton.svg";

const ToPlaylistButton = (props) => {
  // const ToCanvas = useContext(ImageContext);

  // const addToPlay = async (e) => {
  //   e.preventDefault();
  //   const imagedata = props.canvasRef.current.toDataURL();
  //   console.log(imagedata);
  //   const formdata = new FormData();
  //   formdata.append("imagedata", imagedata);
  //   formdata.append("originurl", ToCanvas.url);
  //   await axios
  //     .post("http://localhost:5000/canvas/newimage", formdata, {
  //       headers: {
  //         "content-type": "multipart/form-data",
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <button
      className="toPlaylist"
      onClick={() => {
        props.onClick();
      }}
    >
      <div className="play-button-o">
        <img src={playbutton} alt="playbutton" />
      </div>
      <span className="playlist_label">재생목록에 담기</span>
    </button>
  );
};

export default ToPlaylistButton;
