import React, { useState, useContext, useRef, useEffect } from "react";
import ImageContext from "./Image_Up_Check_Del/ImageContext";
import axios from "axios";

import "./Canvas.css";
import ToPlaylistButton from "../Output/ToPlaylistButton";
import Slider from "./Sliders";
import SidebarItem from "./SidebarItem";
import FrameInterpolation from "./FrameInterpolation";
// import CanvasDraw from "react-canvas-draw";
import html2canvas from "html2canvas";

// import domToImage from "dom-to-image";

const DEFAULT_OPTIONS = [
  {
    name: "Brightness",
    property: "brightness",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Contrast",
    property: "contrast",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Saturation",
    property: "saturate",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Grayscale",
    property: "grayscale",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Sepia",
    property: "sepia",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Hue Rotate",
    property: "hue-rotate",
    value: 0,
    range: {
      min: 0,
      max: 360,
    },
    unit: "deg",
  },
  {
    name: "Blur",
    property: "blur",
    value: 0,
    range: {
      min: 0,
      max: 20,
    },
    unit: "px",
  },
];

function Canvas() {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const selectedOption = options[selectedOptionIndex];
  const canvasRef = useRef(null);
  const [PaintMode, setPaintMode] = useState(false);
  const [Paint, setPaint] = useState(false);
  const [Ctx, setCtx] = useState(null);
  const ToCanvas = useContext(ImageContext);

  // const handleSaveImage = () => {
  //   const dataURL = canvasRef.current.canvas.drawing.toDataURL();
  //   localStorage.setItem("savedImage", dataURL);
  // };

  function handleSliderChange({ target }) {
    setOptions((prevOptions) => {
      return prevOptions.map((option, index) => {
        if (index !== selectedOptionIndex) return option;
        return { ...option, value: target.value };
      });
    });
  }

  function getImageStyle() {
    const filters = options.map((option) => {
      return `${option.property}(${option.value}${option.unit})`;
    });

    return { filter: filters.join(" ") };
  }

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
    const imagedata = await canvasRef.current.toDataURL(
      "image/" + ToCanvas.type
    );
    console.log(imagedata);
    const formdata = new FormData();
    formdata.append("imagedata", imagedata);
    formdata.append("originurl", ToCanvas.url);
    await axios
      .post("http://localhost:5000/canvas/newimage", formdata, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
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
            <div className="uploaded-image">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={getImageStyle()}
                onMouseDown={() => ChangePaint(true)}
                onMouseUp={() => ChangePaint(false)}
                onMouseMove={(e) => drawing(e)}
                onMouseLeave={() => ChangePaint(false)}
              />
            </div>
            {/* <button onClick={onHtmlToPng}>Capture!</button> */}

            <div className="sidebar">
              {options.map((option, index) => {
                return (
                  <SidebarItem
                    key={index}
                    name={option.name}
                    active={index === selectedOptionIndex}
                    handleClick={() => setSelectedOptionIndex(index)}
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
            <Slider
              min={selectedOption.range.min}
              max={selectedOption.range.max}
              value={selectedOption.value}
              handleChange={handleSliderChange}
            />
          </div>
        </div>
        <ToPlaylistButton canvasRef={canvasRef} />
      </div>
    </React.Fragment>
  );
}

export default Canvas;
