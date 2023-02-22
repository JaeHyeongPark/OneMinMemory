import React, { useContext, useRef, useEffect, useState } from "react";
import PlaylistContext from "../../../shared/context/playlist-context";
import "./SoundTrack.css";
import Wavedata from "./Sound/wavedata.json";

const SoundTrack = () => {
  const [newidx, setNewIdx] = useState(0);
  const playlistCtx = useContext(PlaylistContext);
  const canvasRef = useRef(null);

  console.log("idx", newidx);

  useEffect(() => {
    setNewIdx(playlistCtx.musicidx);
  }, [playlistCtx.musicidx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const height = canvas.height;
    const width = canvas.width;
    const centerY = height / 2;

    context.fillStyle = "rgba(255,0,0,0)";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "red";
    context.lineWidth = 1;
    console.log("wave data", Wavedata[newidx]);
    context.beginPath();
    Wavedata[newidx].peaks.forEach((peak, index) => {
      const x = (index / Wavedata[newidx].peaks.length) * width;
      const y = peak * (height / 2) + centerY;
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.stroke();
  }, [newidx]);

  return (
    <div className="soundtrack_layout">
      {/* <audio ref={audioRef} src={src}></audio>
      <div ref={waveformRef}>사운드트랙-{idx}</div> */}
      <canvas
        className="soundtrack_canvas"
        height={60}
        width={5000}
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

export default SoundTrack;

// audio.currentTime => 초. 단위는 찾아볼 것.
// audio.play
// web audio.api html5
