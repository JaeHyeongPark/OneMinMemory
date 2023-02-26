import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";

import Cloud from "../../assets/cloud.svg";
import Editedcloud from "../../assets/editedcloud.svg";
import ImageShow from "./Image_Up_Check_Del/ImageShow";
import ImageUpload from "./Image_Up_Check_Del/ImageUpload";
import ImageDel from "./Image_Up_Check_Del/ImageDel";
import { useParams } from "react-router-dom";
import ImageContext from "./Image_Up_Check_Del/ImageContext";
import PlaylistContext from "../../../shared/context/playlist-context";
import "./PhotoBox.css";

import App from "../../../App.js";
// require("dotenv").config();

const PhotoBox = (props) => {
  const [cloud, setcloud] = useState(true);
  const [view, setview] = useState({});
  const ToCanvas = useContext(ImageContext);
  const playlistCtx = useContext(PlaylistContext);
  const roomId = useParams().roomId;

  // 처음 방에 들어오면 해당 방에 대한 정보를 싸악 받는다.
  useEffect(() => {
    axios
      .post(process.env.REACT_APP_expressURL + "/photoBox/sendimage", {
        roomid: roomId,
      })
      .then((res) => {
        const origin = { ...ToCanvas.origin };
        const effect = { ...ToCanvas.effect };
        res.data.origin.forEach((url) => (origin[url] = 0));
        res.data.effect.forEach((url) => (effect[url] = 0));
        playlistCtx.addToPlaylist(res.data.playlist);
        ToCanvas.setorigin(origin);
        ToCanvas.seteffect(effect);
        playlistCtx.changemusicidx(res.data.playsong[0]);
        playlistCtx.selectmusicsrc(res.data.playsong[1]);
      });
  }, []);

  useEffect(() => {
    if (cloud) {
      setview(ToCanvas.origin);
    } else {
      setview(ToCanvas.effect);
    }
  }, [ToCanvas.origin, cloud, ToCanvas.effect]);

  const Cloudtrue = (e) => {
    e.preventDefault()
    setcloud(true);
  };

  const Cloudfalse = (e) => {
    e.preventDefault()
    setcloud(false);
  };

  App.mainSocket.removeAllListeners("upload");
  App.mainSocket.on("upload", (data) => {
    console.log("수신");
    const neworigin = { ...ToCanvas.origin };
    data.upimg.forEach((url) => (neworigin[url] = 0));
    ToCanvas.setorigin(neworigin);
  });
  App.mainSocket.removeAllListeners("edit");
  App.mainSocket.on("edit", (data) => {
    const neweffect = { ...ToCanvas.effect };
    neweffect[data.editedUrl] = 0;
    ToCanvas.seteffect(neweffect);
  });
  return (
    <React.Fragment>
      <div className="title_and_photobox">
        <div className="title_mode">
          <div
            className="fileupload_title"
            style={cloud ? {} : { borderBottom: "3px solid #272833" }}
            onClick={Cloudtrue}
          >
            <div className="cloud">
              <img src={Cloud} className="img.cloud" alt=""/>
            </div>
            <span
              className="cloud_span"
              style={cloud ? { color: "skyblue" } : { color: "gray" }}
            >
              Original
            </span>
          </div>
          <div
            className="fileupload_title"
            style={cloud ? { borderBottom: "3px solid #272833" } : {}}
            onClick={Cloudfalse}
          >
            <div className="cloud">
              <img src={Editedcloud} className="img.cloud" alt="" />
            </div>
            <span
              className="cloud_span"
              style={cloud ? { color: "gray" } : { color: "skyblue" }}
            >
              Edited
            </span>
          </div>
        </div>
        <div className="PhotoBox">
          <div className="Photos_and_Button">
            <ImageShow view={view} mode={cloud ? "Original" : "Effect"} />
            <div className="PhotoBox-Button">
              <ImageUpload />
              <ImageDel mode={cloud ? "Original" : "Effect"} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PhotoBox;
