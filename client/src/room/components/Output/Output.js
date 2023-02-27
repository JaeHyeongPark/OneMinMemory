import React, { useState, useContext, useRef } from "react";
import Playlist from "./Playlist";
import RenderButton from "./RenderButton";
import Scale from "./Scale";
import InsertMusic from "./InsertMusic";
import SoundTrack from "./SoundTrack";
import PlaylistContext from "../../../shared/context/playlist-context";
import "./Output.css";
import Stepper from "@mui/material/Stepper";
import RenderVoteState from "./RenderVoteState";
import { Box } from "@mui/system";
import EditPermissionButton from "./EditPermissionButton";

const Output = () => {
  const playlistCtx = useContext(PlaylistContext);
  const tagRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(1);
  const [showimg, setshowimg] = useState(false);
  const [imgleft, setimgleft] = useState(0);
  const [imgurl, setimgurl] = useState("");

  function handleSliderChange(event) {
    if (event.target.value > playlistCtx.totaltime || !showimg) {
      return;
    }
    setSliderValue(event.target.value);
    setimgleft((tagRef.current.offsetWidth / 60) * (event.target.value - 1));
    geturl(event.target.value);
  }

  const geturl = (time) => {
    const playlist = playlistCtx.playlist;
    let check = 0;
    for (let i = 0; i < playlist.length; i++) {
      check += playlist[i].duration;
      if (time <= check) {
        setimgurl(playlist[i].url);
        break;
      }
    }
  };

  return (
    <div className="ROOM-FOOTER">
      <div className="ROOM-FOOTER-TEST">
        <div className="TimeandBar">
          <div className="time">
            <div class="slidecontainer" ref={tagRef}>
              {showimg && <img style={{ left: `${imgleft}px` }} src={imgurl} />}
              <input
                type="range"
                min="1"
                max="60"
                value={sliderValue}
                className="slider"
                id="myRange"
                onChange={handleSliderChange}
                onMouseDown={() => setshowimg(true)}
                onMouseUp={() => setshowimg(false)}
              />
            </div>
          </div>
          <div className="TimeBar">
            <Scale></Scale>
          </div>
        </div>
        <Playlist />
        <SoundTrack />
      </div>
      <div className="ROOM-FOOTER-BUTTONS">
        <div className="finished_layout">
          <InsertMusic />
          <Box sx={{ alignContent: "center" }}>
            <Stepper>
              <RenderVoteState />
            </Stepper>
          </Box>
          <RenderButton />
          <EditPermissionButton />
        </div>
      </div>
    </div>
  );
};

export default Output;
