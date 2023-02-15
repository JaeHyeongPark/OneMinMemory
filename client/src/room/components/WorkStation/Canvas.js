import React, { useState, useContext, useRef, useEffect } from "react";
import ImageContext from "./Image_Up_Check_Del/ImageContext";
import axios from "axios";

import "./Canvas.css";
import SidebarItem from "./SidebarItem";
// import FrameInterpolation from "./FrameInterpolation";

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

function Canvas() {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const canvasRef = useRef(null);
  const [PaintMode, setPaintMode] = useState(false);
  const [Paint, setPaint] = useState(false);
  const [Ctx, setCtx] = useState(null);
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

  const newImage = async (e) => {
    e.preventDefault();
    const imagedata = canvasRef.current.toDataURL("image/" + ToCanvas.type);
    //checked
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
          <span className="USER_canvan_span">USER1의 캔버스</span>
        </div>
        <div className="canvas">
          <div className="container">
            <div className="uploaded-image">
              <canvas
                ref={canvasRef}
                width={800}
                height={750}
                onMouseDown={() => ChangePaint(true)}
                onMouseUp={() => ChangePaint(false)}
                onMouseMove={(e) => drawing(e)}
                onMouseLeave={() => ChangePaint(false)}
              />
            </div>

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
              <button className="sidebar-item" onClick={newImage}>
                저장하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Canvas;
