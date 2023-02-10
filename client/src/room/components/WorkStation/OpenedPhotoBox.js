import React, { useState, useEffect } from "react";
import axios from "axios";

import "./OpenedPhotoBox.css";
import softwareupload from "../../assets/software-upload.svg";
import trash from "../../assets/trash.svg";
import Arrow from "../../assets/Arrow.svg";

const OpenedPhotoBox = (props) => {
  // const [images, setimages] = useState([]);
  const [view, setview] = useState([]);
  const [check, setcheck] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/photoBox/upload").then((res) => {
      setview(res.data);
    });
  }, [check]);

  const selectimage = async (e) => {
    e.preventDefault();
    const images = e.target.files;

    const formdata = new FormData();
    for (let i = 0; i < images.length; i++) {
      console.log(images[i], i);
      formdata.append("images", images[i]);
      formdata.append("lastModified", images[i].lastModified);
    }

    axios
      .post("http://localhost:5000/photoBox/upload", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("전송 완료!");
        setcheck(check ? false : true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="opened_photobox_group">
      <div className="opened_photos_and_buttons">
        <div className="opened_preview_photos">
          {view.map((url) => {
            return (
              <img
                key={url}
                src={url}
                alt="a"
                style={{ width: "100px", height: "100px" }}
              />
            );
          })}
        </div>
        <div className="opened_functions">
          <div className="upload_button_group">
            <div className="upload_button">
              <img
                src={softwareupload}
                className="img.software-upload"
                alt="a"
              />
              <label className="upload_label" htmlFor="upload">
                업로드
              </label>
              <input
                type="file"
                id="upload"
                accept="image/*"
                multiple
                onChange={selectimage}
              />
            </div>
          </div>
          <div className="delete_button_group">
            <div className="delete_button">
              <img src={trash} className="img.trash" alt="a" />
              <label className="delete_label">지우기</label>
            </div>
          </div>
        </div>
      </div>
      <div className="close_and_work">
        <button onClick={props.closeBox} className="close_button">
          <img src={Arrow} className="img.Icon-Arrow-up" alt="a" />
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
