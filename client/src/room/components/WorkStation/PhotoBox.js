import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import filters from "../../assets/filters.svg";
import image from "../../assets/image.svg";
import cloud from "../../assets/cloud.svg";
import RightArrow from "../../assets/RightArrow.svg";
import ImageShow from "./Image_Up_Check_Del/ImageShow";
import ImageUpload from "./Image_Up_Check_Del/ImageUpload";
import ImageDel from "./Image_Up_Check_Del/ImageDel";
import "./PhotoBox.css";

const PhotoBox = (props) => {
  const [view, setview] = useState({});
  const [check, setcheck] = useState(true);
  const [check2, setcheck2] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/photoBox/upload").then((res) => {
      setview(res.data);
    });
  }, [check]);

  useEffect(() => {
    axios.get("http://localhost:5000/photoBox/sendimages").then((res) => {
      setview(res.data);
    });
  }, [check2]);

  const changecheck1 = () => {
    setcheck(check ? false : true);
  };

  const changecheck2 = () => {
    setcheck2(check2 ? false : true);
  };

  return (
    <React.Fragment>
      <div className="title_and_photobox">
        <div className="fileupload_title">
          <div className="cloud">
            <img src={cloud} className="img.cloud" alt="" />
          </div>
          <span className="cloud_span">CLOUD</span>
        </div>
        <div className="PhotoBox">
          <div className="Photos_and_Button">
            <ImageShow view={view} change={changecheck1} />
            <div className="PhotoBox-Button">
              <ImageUpload change={changecheck1} />
              <ImageDel change={changecheck2} />
              <div className="filterButton">
                <img src={filters} className="img.filters" alt="a" />
                <label className="filter_label">초점이 안맞는 사진 선택</label>
              </div>
            </div>
          </div>
          <div className="Work_and_arrow">
            <div className="Work">
              <img src={image} className="img.image" alt="move to canvas" />
              <label className="work_label">작 업 하 기</label>
            </div>
            <div className="Arrow">
              <img src={RightArrow} className="img.Icon-Arrow" alt="" />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PhotoBox;
