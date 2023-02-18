import React, { useState, useContext, useRef, useEffect } from "react";
import ImageContext from "./Image_Up_Check_Del/ImageContext";
import axios from "axios";

import "./Canvas.css";
import ToPlaylistButton from "../Output/ToPlaylistButton";
import SidebarItem from "./SidebarItem";
import Transition from "./Transitions/Transition";

const DEFAULT_OPTIONS = [
  {
    name: "Brighten",
  },
  {
    name: "Sharpen",
  },
  {
    name: "Saturate",
  },
  {
    name: "Grayscale",
  },
];
const TRANSITION_PATH = "/Transitions/TransitionList";
const TRANSITION_LIST = [
  "circlecrop",
  "diagtl",
  "dissolve",
  "distance",
  "fadeblack",
  "fadegrays",
  "fadewhite",
  "hblur",
  "hrslice",
  "pixelize",
  "radial",
  "rectcrop",
  "slidedown",
  "slideright",
  "slideup",
  "vuslice",
  "wipelife",
  "wiperight",
];

function Canvas() {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const canvasRef = useRef(null);
  const [TextMode, setTextMode] = useState(false);
  const [inputShow, setinputShow] = useState(false);
  const [PaintMode, setPaintMode] = useState(false);
  const [Paint, setPaint] = useState(false);
  const [transitionModal, setTransitionModal] = useState(false);
  const [Ctx, setCtx] = useState(null);
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const ToCanvas = useContext(ImageContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.style = {};
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setOptions(DEFAULT_OPTIONS);
    setCtx(ctx);

    const image = new Image();
    image.src = ToCanvas.url;
    image.crossOrigin = "*";
    image.onload = () => {
      Ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      Ctx.lineJoin = "round";
      Ctx.lineWidth = 4;
    };
  }, [ToCanvas.url, Ctx]);

  const drawing = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    if (Paint && PaintMode) {
      Ctx.lineTo(x, y);
      Ctx.stroke();
    } else {
      Ctx.beginPath();
      Ctx.moveTo(x, y);
    }
  };
  const ChangePaint = (check) => {
    if (!PaintMode) return;
    if (check) {
      setPaint(check);
    } else {
      setPaint(check);
    }
  };

  const addinput = (e) => {
    if (!TextMode) {
      return;
    }
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const z = canvasRef.current.getBoundingClientRect();
    setX([x - 4, z.x + x - 4]);
    setY([y - 4, z.y + y - 4]);
    setinputShow(true);
  };

  const handleEnter = (e) => {
    const code = e.keyCode;
    if (code === 13) {
      Ctx.textBaseline = "top";
      Ctx.textAlign = "left";
      Ctx.font = "25px fantasy";
      Ctx.fillText(e.target.value, x[0], y[0]);
      setinputShow(false);
      setTextMode(false);
    }
  };

  const newImage = async (e) => {
    e.preventDefault();
    const imagedata = await canvasRef.current.toDataURL(
      "image/" + ToCanvas.type
    );
    console.log(imagedata);
    const formdata = new FormData();
    formdata.append("imagedata", imagedata);
    formdata.append("originurl", ToCanvas.url);
    //checked
    await axios
      .post("http://localhost:5000/canvas/newimage", formdata, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        console.log("성공!");
      })
      .catch((err) => {
        console.log(err);
        console.log("에러!");
      });
  };

  const selectedOptionApply = async (index, name) => {
    setSelectedOptionIndex(index);
    console.log("index:", index);
    console.log("name:", name);
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/" + ToCanvas.type);
    // checkpoint!
    const formdata = new FormData();
    formdata.append(`${name}ImageData`, imageData);
    await axios
      .post(`http://localhost:5000/canvas/image/${name}`, formdata, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("this is res", res);

        const effectedImageData = res.data.effectedImageData;
        if (effectedImageData) {
          const image = new Image();
          image.src = effectedImageData;
          image.crossOrigin = "*";
          image.onload = () => {
            Ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          };
        }
      })
      .catch((err) => {
        console.log("this is error!!!");
      });
  };

  return (
    <React.Fragment>
      <div className="Username_and_canvas">
        <div className="Username">
          <span className="USER_canvas_span">USER1의 캔버스</span>
        </div>
        <div className="canvas">
          <div className="container">
            {!transitionModal ? (
              <div className="uploaded-image">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  onClick={(e) => addinput(e)}
                  onMouseDown={() => ChangePaint(true)}
                  onMouseUp={() => ChangePaint(false)}
                  onMouseMove={(e) => drawing(e)}
                  onMouseLeave={() => ChangePaint(false)}
                />
                {inputShow && (
                  <input
                    type="text"
                    style={{
                      position: "fixed",
                      left: `${x[1]}px`,
                      top: `${y[1]}px`,
                      background: "transparent",
                      height: "30px",
                    }}
                    onKeyDown={handleEnter}
                  />
                )}
              </div>
            ) : (
              <div className="transition-modal">
                {TRANSITION_LIST.map((transition) => {
                  return (
                    <Transition
                      className={transition}
                      selectTransition={transition} // 이 부분 어떤 함수?
                    />
                  );
                })}
              </div>
            )}

            <div className="sidebar">
              {options.map((option, index) => {
                return (
                  <SidebarItem
                    key={index}
                    name={option.name}
                    active={index === selectedOptionIndex}
                    handleClick={() => selectedOptionApply(index, option.name)}
                  />
                );
              })}
              <button
                className="sidebar-item"
                onClick={() => setPaintMode(PaintMode ? false : true)}
              >
                PaintMode-{PaintMode ? "ON" : "OFF"}
              </button>
              <button
                className="sidebar-item"
                onClick={() => {
                  setTextMode(TextMode ? false : true);
                }}
              >
                Text Mode-{TextMode ? "END" : "Write"}
              </button>
              <button
                className="sidebar-item"
                onClick={() => {
                  setTransitionModal(!transitionModal);
                }}
              >
                Transition
              </button>
              <button className="sidebar-item" onClick={newImage}>
                저장하기
              </button>
            </div>
          </div>
        </div>
        <ToPlaylistButton canvasRef={canvasRef} />
      </div>
    </React.Fragment>
  );
}

export default Canvas;
