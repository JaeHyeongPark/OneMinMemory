import React, { useEffect, useState } from "react";
import axios from "axios";
import FileDownload from "js-file-download";
import { useParams } from "react-router-dom";
import infinity from "../../assets/infinity.svg";
import RenderIcon from "../../assets/rendericon.svg";
import CopyIcon from "../../assets/copy_icon.png";
import ExitIcon from "../../assets/logout.png";
import DownIcon from "../../assets/downloading-file.png";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import loadGif from "../../assets/RenderLoading.gif";
import Modal from "@mui/material/Modal";
import App from "../../../App";
import "./RenderButton.css";

// require("dotenv").config();
import SnackBar from "../RoomHeader/SnackBar";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  height: "75%",
  bgcolor: "#272731",
  // border: "2px solid #000",
  borderRadius: "25px",
  outline: "none",
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

  useEffect(() => {
    App.mainSocket.on("startRendering", (data) => {});
  }, []);

  const merge = (e) => {
    if (App.playlistPermissionState === 1) {
      SnackBar.renderWarningOpen();
      return;
    }
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
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="modal">
            <div className="video-player"></div>
            <div className="modal-content">
              {loading ? (
                <video src={finalUrl} controls />
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "40px",
                  }}>
                  <img src={loadGif} style={{ width: "400px" }} />
                  <div
                    style={{
                      fontSize: "30px",
                      color: "#989898",
                      fontFamily: "Pretendard",
                      fontWeight: "bold",
                      fontStretch: "normal",
                      fontStyle: "normal",
                    }}>
                    {percent}
                  </div>
                </div>
              )}
            </div>
            <div
              className="button-container"
              style={{
                paddingLeft: "500px",
                paddingRight: "500px",
                paddingTop: "10px",
              }}>
              <Button variant="contained" onClick={download}>
                <img
                  className="Render-icon"
                  src={DownIcon}
                  alt="downloadIcon"
                />
              </Button>
              <Button variant="contained" onClick={CopyLink}>
                <img className="Render-icon" src={CopyIcon} alt="CopyIcon" />
              </Button>
              <Button variant="contained" onClick={() => setOpen(false)}>
                <img className="Render-icon" src={ExitIcon} alt="CopyIcon" />
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default RenderButton;
