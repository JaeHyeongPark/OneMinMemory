import React from "react";

import softwareupload from "../../assets/software-upload.svg";
import trash from "../../assets/trash.svg";
import filters from "../../assets/filters.svg";
import image from "../../assets/image.svg";
import cloud from "../../assets/cloud.svg";
import RightArrow from "../../assets/RightArrow.svg";
import "./PhotoBox.css";

const PhotoBox = (props) => {
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
            <div className="upload_Photos">
              <div className="upload_Photos_layout">
                <div className="upload_img"></div>
                <div className="upload_img"></div>
                <div className="upload_img"></div>
                <div className="upload_img"></div>
              </div>
            </div>
            <div className="PhotoBox-Button">
              <div className="uploadButton">
                <img
                  src={softwareupload}
                  className="img.software-upload"
                  alt="file upload"
                />
                <label className="upload_label">업로드</label>
              </div>
              <div className="delete_button">
                <img src={trash} className="img.trash" alt="file delete" />
                <label className="delete_label">지우기</label>
              </div>
              <div className="filterButton">
                <img
                  src={filters}
                  className="img.filters"
                  alt="image filter1"
                />
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
