import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import music from "../../assets/music.svg";
import Music from "./Sound/Music";
import axios from "axios";
// require("dotenv").config();
import App from "../../../App";
import SnackBar from "../RoomHeader/SnackBar";

const style = {
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  top: "50%",
  left: "50%",
  justifyContent: "center",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "#272731",
  border: "2px solid #000",
  boxShadow: 24,
  gap: "20px",
  p: 4,
};

const musicItemStyle = {
  borderTop: "1px solid gray",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const selectstyle = {
  color: "272731",
};

export default function InsertMusic() {
  const roomId = useParams().roomId;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedMusicSrc, setSelectedMusicSrc] = useState(null);
  const [selectedMusicIdx, setSelectedMusicIdx] = useState("0");

  const getPresetbyIndex = (idx, src) => {
    if (!selectedMusicIdx) {
      return;
    }
    if (App.playlistPermissionState !== 1) {
      SnackBar.playlistEditWarningOpen();
      return;
    }
    axios
      .post(process.env.REACT_APP_expressURL + `/output/playlistpreset`, {
        idx: idx,
        src: src,
        roomid: roomId,
      })
      .then((res) => {
        if (res.data.success !== true) {
          console.log("응답에러");
        }
      });
    setOpen(false);
  };
  return (
    <div>
      <Button className="Preset" onClick={handleOpen}>
        <div className="Music">
          <img src={music} alt="insert music" />
        </div>
        <span className="preset_span">프리셋</span>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <Box sx={style}>
            {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            추천 음원 리스트
          </Typography> */}
            <Typography id="modal-modal-description" sx={{ mt: 3 }}>
              <Music song={selectedMusicSrc} />
            </Typography>
            <p></p>
            <Button
              className="music-item"
              index={10001}
              style={musicItemStyle}
              onClick={() => {
                setSelectedMusicSrc("../music/Hoang-RunBacktoYou(320kbps).mp3");
                setSelectedMusicIdx("1");
              }}
            >
              <div className="music-item-title">
                Hoang - Run Back to You (feat.Alisa)
              </div>
            </Button>
            <Button
              className="music-item"
              index={10002}
              style={musicItemStyle}
              onClick={() => {
                setSelectedMusicSrc("../music/Newjeans-Ditto(320kbps).mp3");
                setSelectedMusicIdx("2");
              }}
            >
              <div className="music-item-title">Newjeans - Ditto</div>
            </Button>
            <Button
              className="music-item"
              index={10003}
              style={musicItemStyle}
              onClick={() => {
                setSelectedMusicSrc("../music/Coldplay-Yellow(320kbps).mp3");
                setSelectedMusicIdx("3");
              }}
            >
              <div className="music-item-title">Coldplay - Yellow</div>
            </Button>
            <p></p>
            <div className="action-box">
              <Button
                variant="contained"
                style={selectstyle}
                onClick={() => {
                  getPresetbyIndex(selectedMusicIdx, selectedMusicSrc);
                }}
              >
                <span className="selectmusic_span">선택하기</span>
              </Button>
            </div>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
