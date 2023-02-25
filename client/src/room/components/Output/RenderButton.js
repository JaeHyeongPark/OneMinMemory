import React, { useEffect, useState } from "react";
import axios from "axios";
import FileDownload from "js-file-download";
import { useParams } from "react-router-dom";
import infinity from "../../assets/infinity.svg";
import RenderIcon from "../../assets/rendericon.svg";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import loadGif from "../../assets/RenderLoading.gif";
import Modal from "@mui/material/Modal";
import App from "../../../App";
// require("dotenv").config();

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
  const [percent, setpercent] = useState("");
  const [finalUrl, setfinalUrl] = useState("");
  const handleClose = () => setOpen(false);

  const merge = (e) => {
    e.preventDefault();
    setOpen(true);
    if (finalUrl === "") {
      axios({
        method: "post",
        url: process.env.REACT_APP_expressURL + "/output/merge",
        data: {
          roomid: roomId,
        },
      }).then((res) => {
        setfinalUrl(res.data);
        setloading(true);
      });
    }
  };

  const download = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      url: process.env.REACT_APP_expressURL + "/output/download",
      responseType: "blob",
      data: {
        roomid: roomId,
      },
    }).then((res) => {
      console.log(res.data);
      FileDownload(res.data, `oneminute_${Date.now()}.mp4`);
    });
  };

  const CopyLink = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(finalUrl);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    App.mainSocket.on("renderingProgress", (data) => {
      setpercent(data.progress);
    });
  }, []);

  return (
    <div>
      <Button className="Rendering" onClick={merge}>
        <div className="RenderIcon">
          <img src={RenderIcon} alt="video rendering" />
        </div>
        <span className="render_span">렌더링</span>
      </Button>
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
                <video src={finalUrl} controls />
              ) : (
                <>
                  <img src={loadGif} />
                  현재 {percent} % 진행중..
                </>
              )}
            </div>
            <div className="button-container">
              <button onClick={download}>다운로드</button>
              <button onClick={CopyLink}>링크</button>
              <button onClick={() => setOpen(false)}>나가기</button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default RenderButton;
