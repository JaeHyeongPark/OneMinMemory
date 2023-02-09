import React from "react";

import "./OpenedPhotoBox.css";
import softwareupload from "../../assets/software-upload.svg";
import trash from "../../assets/trash.svg";
import Arrow from "../../assets/Arrow.svg";

const OpenedPhotoBox = (props) => {
  return (
    <div class="opened_photobox_group">
      <div class="opened_photos_and_buttons">
        <div class="opened_preview_photos"></div>
        <div class="opened_functions">
          <div class="upload_button_group">
            <div class="upload_button">
              <img src={softwareupload} className="img.software-upload" />
              <label className="upload_label">업로드</label>
            </div>
          </div>
          <div class="delete_button_group">
            <div class="delete_button">
              <img src={trash} className="img.trash" />
              <label className="delete_label">지우기</label>
            </div>
          </div>
        </div>
      </div>
      <div class="close_and_work">
        <button onClick={props.closeBox} class="close_button">
          <img src={Arrow} className="img.Icon-Arrow-up" />
        </button>
        <div className="work_layout">
          <div className="work_button_group">
            <div className="work_button">
              <label className="work_label">작업하기</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenedPhotoBox;
