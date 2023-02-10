import React from "react";

import Arrow from "../../assets/Arrow.svg";
import "./PhotoBox.css";

const PhotoBox = (props) => {
  return (
    // <div className="closed_photobox_group">
    //   <div className="closed_photobox">
    //     <div className="closed_preview_photos"></div>
    //     <div className="open_and_work">
    //       <button onClick={props.openBox} className="open_button">
    //         <img src={Arrow} className="Icon-Arrow" />
    //       </button>
    //       <div className="work_layout">
    //         <div className="work_button_group">
    //           <div className="work_button">
    //             <label className="work_label">작업하기</label>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div class="PhotoBox">
      <div class="PhotosButton">
        <div class="upload_Photos">
          <div class="upload_Photos_layout">
            <div class="upload_img"></div>
            <div class="upload_img"></div>
            <div class="upload_img"></div>
            <div class="upload_img"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoBox;
