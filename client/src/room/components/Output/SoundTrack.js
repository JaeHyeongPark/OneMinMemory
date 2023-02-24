import React, { useContext, useRef, useEffect, useState } from "react";
import PlaylistContext from "../../../shared/context/playlist-context";
import "./SoundTrack.css";
import Wavedata from "./Sound/wavedata.json";

const SoundTrack = () => {
  const playlistCtx = useContext(PlaylistContext);
  const [newidx, setNewIdx] = useState(0);
  const [newsrc, setNewSrc] = useState("");
  const canvasRef = useRef(null);
  const layoutRef = useRef(null);
  const audioRef = useRef("");

  useEffect(() => {
    if (newidx !== playlistCtx.musicidx){
      setNewSrc(playlistCtx.musicsrc);
      setNewIdx(playlistCtx.musicidx);
    }
  }, [playlistCtx.musicidx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layout = layoutRef.current;

    canvas.width = (Wavedata[newidx].duration / 60) * (layout.offsetWidth - 40);

    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    const height = canvas.height;
    const width = canvas.width;
    const centerY = height / 2;
    context.fillStyle = "rgba(255,0,0,0)";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "red";
    context.lineWidth = 1;
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

    function handleClick(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const proportion = x / width;
      console.log(proportion);
      const myAudio = audioRef.current;
      myAudio.currentTime = Wavedata[newidx].duration * proportion;
      myAudio.play();
    }

    canvas.addEventListener("click", handleClick);

    function handleKeyDown(event) {
      if (event.keyCode === 32) {
        const myAudio = audioRef.current;
        if (!myAudio.paused) {
          myAudio.pause();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [newidx]);

  return (
    <div className="soundtrack_layout" ref={layoutRef}>
      <audio ref={audioRef} src={newsrc} id="myAudio"></audio>
      <canvas
        className="soundtrack_canvas"
        height={40}
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

export default SoundTrack;

// audio.currentTime => 초. 단위는 찾아볼 것.
// audio.play
// web audio.api html5
