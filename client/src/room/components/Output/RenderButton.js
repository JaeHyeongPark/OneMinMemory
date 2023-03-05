import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import FileDownload from "js-file-download";
import { useParams } from "react-router-dom";
import CopyIcon from "../../assets/copy_icon.png";
import ExitIcon from "../../assets/logout.png";
import DownIcon from "../../assets/downloading-file.png";
import RenderIcon from "../../assets/rendericon.svg";
import voteO from "../../assets/voteO.svg";
import voteX from "../../assets/voteX.svg";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import loadGif from "../../assets/RenderLoading.gif";
import Stepper from "@mui/material/Stepper";
import RenderVoteState from "./RenderVoteState";
import Modal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import App from "../../../App";
import "./RenderButton.css";
import PlaylistContext from "../../../shared/context/playlist-context";
import SnackBar from "../RoomHeader/SnackBar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  height: "75%",
  bgcolor: "#272731",
  // border: "2px solid #000",
  borderRadius: "10px",
  outline: "none",
  boxShadow: 24,
  p: 4,
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RenderButton = () => {
  const roomId = useParams().roomId;
  const [open, setOpen] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [loading, setloading] = useState(false);
  const [percent, setpercent] = useState("");
  const [finalUrl, setfinalUrl] = useState("");
  const handleClose = () => setOpen(false);
  const playlistCtx = useContext(PlaylistContext);
  const [myVoteState, setMyVoteState] = useState(false);

  useEffect(() => {
    App.mainSocket.on("renderingProgress", (data) => {
      setpercent(data.progress);
    });
    App.mainSocket.on("mergeStart", (data) => {
      handleRenderOffButton();
      setloading(false);
      setOpen(true);
    });
    App.mainSocket.on("mergeFinished", (data) => {
      setfinalUrl(data.videoURL);
      setloading(true);
    });
  }, []);

  const handleRenderOffButton = () => {
    setMyVoteState(false);
    App.mainSocket.emit("IVoted", {
      Id: App.mainSocket.id,
      roomId: App.roomId,
      voteState: false,
    });
  };
  const handleRenderOnButton = () => {
    if (App.playlistPermissionState === 1) {
      SnackBar.renderWarningOpen();
      return;
    }
    if (playlistCtx.playlist.length == 0) {
      SnackBar.playlistEmptyWarningOpen();
      return;
    }
    for (let i = 0; i < playlistCtx.playlist.length; i++) {
      console.log(playlistCtx.playlist[i]);
      if (!playlistCtx.playlist[i].url) {
        SnackBar.playlistUrlWarningOpen();
        return;
      }
    }
    const canIMerge = RenderVoteState.handleRenderOnButton();
    console.log(canIMerge);
    setMyVoteState(true);
    App.mainSocket.emit("IVoted", {
      Id: App.mainSocket.id,
      roomId: App.roomId,
      voteState: true,
    });
    if (canIMerge) {
      merge();
    }
  };
  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  // playlist의 이미지들로 영상 제작 요청
  const merge = () => {
    axios({
      method: "post",
      url: process.env.REACT_APP_expressURL + "/FFmpeg/merge",
      data: {
        roomid: roomId,
      },
    }).then((res) => {
      if (res.data.success !== true) {
        console.log("응답에러");
      }
    });
  };

  // 랜더링 완료후 영상 다운로드
  const download = async (e) => {
    e.preventDefault();
    if (finalUrl === "") return;
    try {
      const res = await axios.get(finalUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "omm.mp4");
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
      await navigator.clipboard.writeText(finalUrl);
      setOpenSnack(true);
    } catch (err) {
      console.error(err);
    }
  };

  const openmodal = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(true);
  };

  return (
    <div>
      <Button
        // sx={{ marginLeft: "auto" }}
        className="Rendering"
        onClick={openmodal}
      >
        <div className="Render_img_layout">
          <img src={RenderIcon} alt="Rendering" className="Render_img" />
        </div>
        <span className="render_span">EXPORT</span>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal">
            <div className="content-and-vote">
              <div className="modal-content">
                {loading ? (
                  <div className="video-and-buttons">
                    <div className="video_layout">
                      <video src={finalUrl} controls />
                    </div>
                    <div className="button-container">
                      <Button onClick={download}>
                        <img
                          className="Render-icon"
                          src={DownIcon}
                          alt="downloadIcon"
                        />
                      </Button>
                      <Button onClick={CopyLink}>
                        <img
                          className="Render-icon"
                          src={CopyIcon}
                          alt="CopyIcon"
                        />
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
                      <Button onClick={() => setOpen(false)}>
                        <img
                          className="Render-icon"
                          src={ExitIcon}
                          alt="CopyIcon"
                        />
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
                      {percent}
                    </div>
                  </div>
                )}
              </div>
              <div className="vote-container">
                <Box sx={{ alignContent: "center" }}>
                  <Stepper>
                    <RenderVoteState />
                  </Stepper>
                </Box>
                {myVoteState ? (
                  <Button
                    className="Rendervote"
                    onClick={handleRenderOffButton}
                  >
                    <div className="Render_img_layout">
                      <img src={voteX} alt="Rendering" className="Render_img" />
                    </div>
                    <span className="render_span">CANCEL</span>
                  </Button>
                ) : (
                  <Button className="Rendervote" onClick={handleRenderOnButton}>
                    <div className="Render_img_layout">
                      <img src={voteO} alt="Rendering" className="Render_img" />
                    </div>
                    <span className="render_span">Request Rendering</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default RenderButton;
