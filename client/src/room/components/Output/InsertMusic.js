import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import music from "../../assets/music.svg";
import Music from "./Sound/Music";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "gainsboro",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const musicItemStyle = {
  borderTop: "1px solid gray",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};
const musicItemTitleStyle = {};
const musicItemArtistStyle = {};

export default function InsertMusic() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedMusicSrc, setSelectedMusicSrc] = useState(null);
  const selectMusic = (src) => {
    setSelectedMusicSrc(src);
  };
  return (
    <div>
      <Button className="insert_music_button" onClick={handleOpen}>
        <div className="insert_music_icon">
          <img src={music} alt="insert music" />
        </div>
        음악넣기
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            추천 음원 리스트
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 3 }}>
            <Music song={selectedMusicSrc} />
          </Typography>
          <Button
            className="music-item"
            index={1}
            style={musicItemStyle}
            onClick={() => selectMusic("./music/abc.mp3")}
          >
            <div className="music-item-title">Run Back to You (feat.Alisa)</div>
            <div className="music-item-artist">Hoang</div>
          </Button>
          <Button
            className="music-item"
            index={2}
            style={musicItemStyle}
            onClick={() => selectMusic("./music/뉴진스.mp3")}
          >
            <div className="music-item-title">뉴진스 (feat.Alisa)</div>
            <div className="music-item-artist">hype boy</div>
          </Button>
          <div className="action-box">
            <Button
              variant="contained"
              onClick={() => {
                //
                handleClose();
              }}
            >
              선택
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
