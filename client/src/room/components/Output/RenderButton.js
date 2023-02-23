import React, { useState } from "react";
import axios from "axios";
import FileDownload from "js-file-download";
import { useParams } from "react-router-dom";

import infinity from "../../assets/infinity.svg";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  height: "75%",
  bgcolor: "gainsboro",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const RenderButton = () => {
  const roomId = useParams().roomId;
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const handleClose = () => setOpen(false);

  const merge = (e) => {
    e.preventDefault();
    setOpen(true);
    console.log("다운로드 버튼 클릭 !");
    axios({
      method: "post",
      url: "http://localhost:5000/output/merge",
      responseType: "blob",
      data: {
        roomid:roomId
      },
    }).then((res) => {
      // FileDownload(res.data, `oneminute_${Date.now()}.mp4`);
      console.log(res.data)
      setloading(true)
    });
  };

  return (
    <div className="render_button_group">
      <button className="render_button" onClick={merge}>
        <img src={infinity} className="img.infinity" alt="video rendering" />
        <label className="render_label">렌더링</label>
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal">
            <div className="video-player"></div>
            <div className="modal-content">
              {loading ? (
                <video src="../TransitionList/diagtl.mp4" controls />
              ) : (
                "loading...."
              )}
            </div>
            <div className="button-container">
              <button>업로드</button>
              <button>링크</button>
              <button onClick={() => setOpen(false)}>나가기</button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default RenderButton;
