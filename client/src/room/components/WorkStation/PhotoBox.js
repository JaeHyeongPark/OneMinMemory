import React from "react";
import { useState, useEffect, useContext} from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import axios from "axios";

import Cloud from "../../assets/cloud.svg";
import ImageShow from "./Image_Up_Check_Del/ImageShow";
import ImageUpload from "./Image_Up_Check_Del/ImageUpload";
import ImageDel from "./Image_Up_Check_Del/ImageDel";
import ImageContext from "./Image_Up_Check_Del/ImageContext";
import "./PhotoBox.css";

const PhotoBox = (props) => {
  const [cloud, setcloud] = useState(true)
  const [view, setview] = useState({})
  const ToCanvas = useContext(ImageContext)
  const AuthCtx = useContext(AuthContext);

  useEffect(() => {
    const filename = cloud ? "Original" : "Effect"
      axios.post("http://localhost:5000/photoBox/sendimage", {filename : filename, roomid:AuthCtx.rooomId}).then((res) => {
        const origin = {...ToCanvas.origin}
        const effect = {...ToCanvas.effect}
        res.data.origin.forEach((url) => origin[url] = 0)
        res.data.effect.forEach((url) => effect[url] = 0)
        ToCanvas.setorigin(origin)
        ToCanvas.seteffect(effect)
      });
  }, []);

  useEffect(() => {
    if (cloud){
      setview(ToCanvas.origin)
    }else{
      setview(ToCanvas.effect)
    }
  }, [ToCanvas.origin, cloud, ToCanvas.effect])

  const CloudChange = () => {
    setcloud(cloud ? false : true)
  }

  return (
    <React.Fragment>
      <div className="title_and_photobox">
        <div className="fileupload_title">
          <div className="cloud">
            <img src={Cloud} className="img.cloud" alt="" />
          </div>
          <span className="cloud_span" onClick={CloudChange}>{cloud ? "CLOUD - Original" : "CLOUD - Effect"}</span>
        </div>
        <div className="PhotoBox">
          <div className="Photos_and_Button">
            <ImageShow view={view} mode={cloud ? "Original" : "Effect"}/>
            <div className="PhotoBox-Button">
              <ImageUpload/>
              <ImageDel mode={cloud ? "Original" : "Effect"}/>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PhotoBox;
