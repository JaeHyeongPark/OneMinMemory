import React from "react";
import axios from "axios";

import infinity from "../../assets/infinity.svg";

const RenderButton = () => {
  //   const getlist = () => {
  //     axios.get("http://localhost:5000/photoBox/playlist").then((res) => {
  //       console.log(res.data);
  //     });
  //   };

  const merge = () => {
    axios.post("http://localhost:5000/output/merge").then((res) => {
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
