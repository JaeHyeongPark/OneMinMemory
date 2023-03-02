import React, { useState, useContext, useRef, useEffect } from "react";
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
    if (event.target.value > playlistCtx.totaltime * 10 || !showimg) {
      return;
    }
    setSliderValue(event.target.value);
    setimgleft((tagRef.current.offsetWidth / 600) * (event.target.value - 0.1));
    geturl(event.target.value);
  }
  useEffect(() => {
    if (sliderValue > playlistCtx.totaltime * 10 || !showimg) {
      setshowimg(false);
      return;
    }
    setSliderValue(sliderValue);
    setimgleft((tagRef.current.offsetWidth / 600) * (sliderValue - 0.1));
    geturl(sliderValue);
  }, [sliderValue]);

  const geturl = (time) => {
    const playlist = playlistCtx.playlist;
    let check = 0;
    for (let i = 0; i < playlist.length; i++) {
      check += playlist[i].duration * 10;
      if (time <= check) {
        setimgurl(playlist[i].url);
        break;
      }
    }
  };

  const changeTime = (time) => {
    setSliderValue(time);
  };

  return (
    <div className="ROOM-FOOTER">
      <div className="ROOM-FOOTER-TEST">
        <div className="TimeandBar">
          <div className="time">
            <div className="slidecontainer" ref={tagRef}>
              {showimg && <img style={{ left: `${imgleft}px` }} src={imgurl} />}
              <input
                type="range"
                min="1"
                max="600"
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
        <SoundTrack changetime={changeTime} changeshow={setshowimg} />
      </div>
      <div className="ROOM-FOOTER-BUTTONS">
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
  );
};

export default Output;
