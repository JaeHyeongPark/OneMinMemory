import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";

import music from "../../assets/music.svg";
import Music from "./Sound/Music";
import axios from "axios";
import ditto_album from "../../assets/ditto_album.jpg";
import runbacktoyou_album from "../../assets/runbacktoyou_album.jpg";
import yellow_album from "../../assets/yellow_album.jpg";
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
  width: 700,
  bgcolor: "#272731",
  border: "2px solid #000",
  boxShadow: 24,
  gap: "10px",
  p: 5,
};

const mytheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#404040",
    },
  },
});

const musicItemStyle = {
  border: "1px solid gray",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: "15px",
};

export default function InsertMusic() {
  const roomId = useParams().roomId;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedMusicSrc, setSelectedMusicSrc] = useState(null);
  const [selectedMusicIdx, setSelectedMusicIdx] = useState("0");
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

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

  useEffect(() => {
    if (!open) {
      setIsPlayingMusic(false);
    }
  }, [open]);

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
          <ThemeProvider theme={mytheme}>
            <Box sx={style}>
              {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            추천 음원 리스트
          </Typography> */}
              <Typography id="modal-modal-description" sx={{ mt: 3 }}>
                <Music song={selectedMusicSrc} isPlaying={isPlayingMusic} />
              </Typography>
              <div className="music_buttons">
                <Button
                  className="music-item"
                  color="secondary"
                  variant="contained"
                  index={10001}
                  style={musicItemStyle}
                  onClick={() => {
                    setSelectedMusicSrc(
                      "../music/Hoang-RunBacktoYou(320kbps).mp3"
                    );
                    setSelectedMusicIdx("1");
                    setIsPlayingMusic(true);
                  }}
                >
                  <div className="album_image">
                    <img
                      src={runbacktoyou_album}
                      className="album_image"
                      alt="album"
                    />
                  </div>
                  <div className="music-item-title">
                    Hoang - Run Back to You (feat.Alisa)
                  </div>
                </Button>
                <Button
                  className="music-item"
                  color="secondary"
                  variant="contained"
                  index={10002}
                  style={musicItemStyle}
                  onClick={() => {
                    setSelectedMusicSrc("../music/Newjeans-Ditto(320kbps).mp3");
                    setSelectedMusicIdx("2");
                    setIsPlayingMusic(true);
                  }}
                >
                  <div className="album_image">
                    <img
                      src={ditto_album}
                      className="album_image"
                      alt="album"
                    />
                  </div>
                  <div className="music-item-title">Newjeans - Ditto</div>
                </Button>
                <Button
                  className="music-item"
                  color="secondary"
                  variant="contained"
                  index={10003}
                  style={musicItemStyle}
                  onClick={() => {
                    setSelectedMusicSrc(
                      "../music/Coldplay-Yellow(320kbps).mp3"
                    );
                    setSelectedMusicIdx("3");
                    setIsPlayingMusic(true);
                  }}
                >
                  <div className="album_image">
                    <img
                      src={yellow_album}
                      className="album_image"
                      alt="album"
                    />
                  </div>
                  <div className="music-item-title">Coldplay - Yellow</div>
                </Button>
              </div>
              <div className="action-box">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    getPresetbyIndex(selectedMusicIdx, selectedMusicSrc);
                  }}
                >
                  <span className="selectmusic_span">선택하기</span>
                </Button>
              </div>
            </Box>
          </ThemeProvider>
        </div>
      </Modal>
    </div>
  );
}
