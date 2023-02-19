import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";

import Cloud from "../../assets/cloud.svg";
import ImageShow from "./Image_Up_Check_Del/ImageShow";
import ImageUpload from "./Image_Up_Check_Del/ImageUpload";
import ImageDel from "./Image_Up_Check_Del/ImageDel";
import WorkButton from "./Image_Up_Check_Del/WorkButton";
import ImageContext from "./Image_Up_Check_Del/ImageContext";
import "./PhotoBox.css";
import App from "../../../App.js";

const PhotoBox = (props) => {
  const [cloud, setcloud] = useState(true);
  const [check, setcheck] = useState(true);
  const [view, setview] = useState({});
  const [upload, setupload] = useState(true);
  const ToCanvas = useContext(ImageContext);

  useEffect(() => {
    const filename = cloud ? "Original" : "Effect";
    axios
      .post("http://localhost:5000/photoBox/sendimage", { filename: filename })
      .then((res) => {
        setview(res.data);
      });
  }, [cloud, check, upload]);

  const updatePicture = (isOriginal) => {
    console.log(cloud, isOriginal);
    setupload(cloud === isOriginal ? !upload : upload);
  };

  useEffect(() => {
    App.mainSocket.on("upload", (data) => {
      updatePicture(true);
    });

    App.mainSocket.on("delete", (data) => {
      updatePicture(true);
    });

    App.mainSocket.on("edit", (data) => {
      updatePicture(true);
    });
  }, []);

  useEffect(() => {
    setview(ToCanvas.view);
  }, [ToCanvas.view]);

  const changecheck = () => {
    setcheck(check ? false : true);
  };

  const CloudChange = () => {
    console.log("클라우드 변환 확인");
    setcloud(cloud ? false : true);
  };

  return (
    <React.Fragment>
      <div className="title_and_photobox">
        <div className="fileupload_title">
          <div className="cloud">
            <img src={Cloud} className="img.cloud" alt="" />
          </div>
          <span className="cloud_span" onClick={CloudChange}>
            {cloud ? "CLOUD - Original" : "CLOUD - Effect"}
          </span>
        </div>
        <div className="PhotoBox">
          <div className="Photos_and_Button">
            <ImageShow view={view} mode={cloud ? "Original" : "Effect"} />
            <div className="PhotoBox-Button">
              <ImageUpload change={changecheck} />
              <ImageDel
                change={changecheck}
                mode={cloud ? "Original" : "Effect"}
              />
            </div>
          </div>
          {/* <WorkButton view={view} /> */}
        </div>
      </div>
    </React.Fragment>
  );
};

export default PhotoBox;
