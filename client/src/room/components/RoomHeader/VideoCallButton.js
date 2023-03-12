import Button from "@mui/material/Button";
import { Mic, MicOff, VideocamOff, Videocam } from "@mui/icons-material";
import React from "react";
import { useState } from "react";
import WebRTC from "../WebRTC/WebRTC";

const VideoCallButton = (props) => {
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const changeAudioState = () => {
    if (WebRTC.handleMuteBtn()) {
      setAudio(audio ? false : true);
    }
  };
  const changeVideoState = () => {
    if (WebRTC.handleCameraBtn()) {
      setVideo(video ? false : true);
    }
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
