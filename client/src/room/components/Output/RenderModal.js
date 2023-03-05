import { useState } from "react";
import React from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import CopyIcon from "../../assets/copy_icon.png";
import ExitIcon from "../../assets/logout.png";
import DownIcon from "../../assets/downloading-file.png";
import loadGif from "../../assets/RenderLoading.gif";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const RenderModal = (props) => {
    const [openSnack, setOpenSnack] = useState(false);

  // 랜더링 완료후 영상 다운로드
  const download = async (e) => {
    e.preventDefault();
    if (props.finalUrl === "") return;
    try {
      const res = await axios.get(props.finalUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${Date.now()}.mp4`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log(err);
    }
  };

  // 랜더링 완료후 영상 URL 클립보드 저장
  const CopyLink = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(props.finalUrl);
      setOpenSnack(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  return (
    <div className="modal-content">
      {props.loading ? (
        <div className="video-and-buttons">
          <div className="video_layout">
            <video src={props.finalUrl} controls />
          </div>
          <div className="button-container">
            <Button onClick={download}>
              <img className="Render-icon" src={DownIcon} alt="downloadIcon" />
            </Button>
            <Button onClick={CopyLink}>
              <img className="Render-icon" src={CopyIcon} alt="CopyIcon" />
            </Button>
            <Snackbar
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={openSnack}
              autoHideDuration={2000}
              onClose={handleClose2}
            >
              <Alert
                onClose={handleClose2}
                severity="success"
                sx={{ width: "100%" }}
              >
                동영상 링크 복사 완료
              </Alert>
            </Snackbar>
            <Button onClick={() => props.setOpen(false)}>
              <img className="Render-icon" src={ExitIcon} alt="CopyIcon" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <img src={loadGif} style={{ width: "30%" }} />
          <div
            style={{
              fontSize: "2rem",
              color: "#989898",
              fontFamily: "Pretendard",
              fontWeight: "bold",
              fontStretch: "normal",
              fontStyle: "normal",
            }}
          >
            {props.percent}
          </div>
        </div>
      )}
    </div>
  );
};
export default RenderModal;
