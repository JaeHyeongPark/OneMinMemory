import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import RenderModal from "./RenderModal";
import RenderIcon from "../../assets/rendericon.svg";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import RenderVoteState from "./RenderVoteState";
import Modal from "@mui/material/Modal";
import App from "../../../App";
import "./RenderButton.css";
import PlaylistContext from "../../../shared/context/playlist-context";
import SnackBar from "../RoomHeader/SnackBar";
import voteSound from "../../assets/voteSound.mp3";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  height: "75%",
  bgcolor: "#272731",
  borderRadius: "10px",
  outline: "none",
  boxShadow: 24,
  p: 4,
};

const RenderButton = () => {
  const votesound = new Audio(voteSound);
  const roomId = useParams().roomId;
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [percent, setpercent] = useState("");
  const [finalUrl, setfinalUrl] = useState("");
  const handleClose = () => setOpen(false);
  const playlistCtx = useContext(PlaylistContext);
  const [myVoteState, setMyVoteState] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [numPeople, setNumPeople] = useState([1]);
  const changeNumPeople = (numUsers) => {
    let newList = [];
    for (let i = 0; i < numUsers; i++) {
      newList.push([1]);
    }
    setNumPeople(newList);
  };
  RenderButton.setActiveStep = setActiveStep;
  RenderButton.changeNumPeople = changeNumPeople;
  useEffect(() => {
    App.mainSocket.on("renderingProgress", (data) => {
      setpercent(data.progress);
    });
    App.mainSocket.on("mergeStart", (data) => {
      setloading(false);
      setOpen(true);
    });
    App.mainSocket.on("mergeFinished", (data) => {
      setfinalUrl(data.videoURL);
      setloading(true);
      handleRenderOffButton();
    });
    App.mainSocket.on("someoneCame", (data) => {
      changeNumPeople(Number(data.numUsers));
    });
    App.mainSocket.on("someoneVoted", (data) => {
      setActiveStep(data.renderVoteState);
      votesound.play();
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
    if (playlistCtx.playlist.length === 0) {
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
    setActiveStep(activeStep + 1);
    setMyVoteState(true);
    App.mainSocket.emit("IVoted", {
      Id: App.mainSocket.id,
      roomId: App.roomId,
      voteState: true,
    });
    if (activeStep + 1 === numPeople.length) {
      merge();
    }
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

  const openmodal = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <div>
      <Button
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
              <RenderModal
                loading={loading}
                finalUrl={finalUrl}
                percent={percent}
                setOpen={setOpen}
              />
              <RenderVoteState
                numPeople={numPeople}
                activeStep={activeStep}
                myVoteState={myVoteState}
                handleRenderOffButton={handleRenderOffButton}
                handleRenderOnButton={handleRenderOnButton}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default RenderButton;
