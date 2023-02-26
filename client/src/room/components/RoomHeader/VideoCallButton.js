import Button from "@mui/material/Button";
import { Mic, MicOff, VideocamOff, Videocam } from "@mui/icons-material";
import React from "react";
import { useEffect, useState } from "react";
import WebRTC from "../WebRTC/WebRTC";

const VideoCallButton = (props) => {
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const changeAudioState = () => {
    setAudio(audio ? false : true);
    WebRTC.handleMuteBtn();
  };
  const changeVideoState = () => {
    setVideo(video ? false : true);
    WebRTC.handleCameraBtn();
  };
  return (
    <>
      <Button
        id="audioBtn"
        variant="contained"
        sx={{
          display: "flex",
          width: "120px",
          marginRight: "29px",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "40px",
        }}
        onClick={changeAudioState}
      >
        {audio ? <Mic /> : <MicOff />}
      </Button>
      <Button
        id="audioBtn"
        variant="contained"
        sx={{
          display: "flex",
          width: "120px",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={changeVideoState}
      >
        {video ? <Videocam /> : <VideocamOff />}
      </Button>
    </>
  );
};

export default VideoCallButton;
