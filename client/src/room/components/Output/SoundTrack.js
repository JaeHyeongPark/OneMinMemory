import React, { useContext, useRef, useEffect, useState } from "react";
import PlaylistContext from "../../../shared/context/playlist-context";
import "./SoundTrack.css";
import Wavedata from "./Sound/wavedata.json";
import { ConstructionOutlined } from "@mui/icons-material";

const SoundTrack = (props) => {
  const playlistCtx = useContext(PlaylistContext);
  const [newidx, setNewIdx] = useState("0");
  const [clickidx, setClickIdx] = useState(0);
  const [newsrc, setNewSrc] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef(null);
  const layoutRef = useRef(null);
  const audioRef = useRef("");

  function handleClick(event) {
    props.changeshow(true);
    const canvas = canvasRef.current;
    const layout = layoutRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const thatIdx =
      (x * (Wavedata[newidx].peaks.length * 60)) /
      (Wavedata[newidx].duration * canvas.width);

    // 클릭이벤트가 발생한 곳이 몇 번째 peak인지 idx를 저장
    setClickIdx(Math.ceil(thatIdx));

    // 여기부터 파형 색칠
    context.beginPath();
    context.strokeStyle = "skyblue";
    context.lineWidth = 1;

    // 노란색으로 파형 색칠
    Wavedata[newidx].peaks.forEach((peak, index) => {
      const x =
        (index /
          (Wavedata[newidx].peaks.length * (60 / Wavedata[newidx].duration))) *
        canvas.width;
      const y = peak * (canvas.height / 2) + canvas.height / 2;
      if (index === 0) {
        context.moveTo(x, y);
      } else if (index < Math.ceil(thatIdx)) {
        context.lineTo(x, y);
      } else {
        return false;
      }
    });
    context.stroke();

    // 하얀색으로 파형 색칠
    context.beginPath();
    context.strokeStyle = "white";
    context.lineWidth = 1;

    let tempIdx = Math.ceil(thatIdx);

    for (let i = tempIdx; i < Wavedata[newidx].peaks.length; i++) {
      const x =
        (i /
          (Wavedata[newidx].peaks.length * (60 / Wavedata[newidx].duration))) *
        canvas.width;
      const y =
        Wavedata[newidx].peaks[i] * (canvas.height / 2) + canvas.height / 2;
      if (i === tempIdx) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }

    context.stroke();
    //여기까지
    const proportion =
      x / ((Wavedata[newidx].duration / 60) * layout.offsetWidth);
    const myAudio = audioRef.current;
    myAudio.currentTime = Wavedata[newidx].duration * proportion;
    myAudio.play();
    console.log("proportion : " + proportion);
    console.log("currentTime : " + myAudio.currentTime);

    // start coloring the waveform every 0.1s while the audio is playing
    setIsPlaying(true);

    const interval = setInterval(() => {
      if (myAudio.paused) {
        clearInterval(interval);
        setIsPlaying(false);
        return;
      }
      const currentTime = myAudio.currentTime;
      const duration = Wavedata[newidx].duration;
      const currentIdx = (currentTime / duration) * 4800;
      console.log("조민 :  " + currentTime.toFixed(1) * 10);
      // 0.1초 단위로 위의 타임바 변경
      props.changetime(currentTime.toFixed(1) * 10);

      // Color the waveform yellow up to the current playback position
      context.beginPath();
      context.strokeStyle = "skyblue";
      context.lineWidth = 1;

      for (let i = 0; i < currentIdx; i++) {
        const x =
          (i /
            (Wavedata[newidx].peaks.length *
              (60 / Wavedata[newidx].duration))) *
          canvas.width;
        const y =
          Wavedata[newidx].peaks[i] * (canvas.height / 2) + canvas.height / 2;
        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.stroke();
    }, 100);
  }

  function handleKeyDown(event) {
    if (event.keyCode === 32) {
      const myAudio = audioRef.current;
      props.changeshow(false);
      if (!myAudio.paused) {
        myAudio.pause();
      }
    }
  }

  useEffect(() => {
    if (newidx !== playlistCtx.musicidx) {
      setNewSrc(playlistCtx.musicsrc);
      setNewIdx(playlistCtx.musicidx);
    }
  }, [playlistCtx.musicidx]);

  // 프리셋 고르면 캔버스에 파형 그려주는 useeffect
  useEffect(() => {
    const canvas = canvasRef.current;
    const layout = layoutRef.current;
    canvas.width = layout.offsetWidth;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const height = canvas.height;
    const width = canvas.width;
    const centerY = height / 2;
    const duration = Wavedata[newidx].duration;

    context.fillStyle = "rgba(255,255,255,0.1)";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "white";
    context.lineWidth = 1;
    context.beginPath();

    Wavedata[newidx].peaks.forEach((peak, index) => {
      const x =
        (index / (Wavedata[newidx].peaks.length * (60 / duration))) * width;
      const y = peak * (height / 2) + centerY;
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.stroke();

    canvas.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [newidx]);

  return (
    <div className="soundtrack_layout" ref={layoutRef}>
      <audio ref={audioRef} src={newsrc} id="myAudio"></audio>
      <canvas className="soundtrack_canvas" ref={canvasRef}></canvas>
    </div>
  );
};

export default SoundTrack;
