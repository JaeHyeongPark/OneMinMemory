import React, { useState, useContext, useRef, useEffect } from "react";
import ImageContext from "./Image_Up_Check_Del/ImageContext";
import axios from "axios";
import CanvasDraw from "react-canvas-draw";

import "./Canvas.css";
import Slider from "./Sliders";
import SidebarItem from "./SidebarItem";

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
  const ToCanvas = useContext(ImageContext);

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

  // const newImageUrl = () => {
  //   const params = {
  //     imageUrl: ToCanvas.url[0],
  //     brightness: Number(options[0].value),
  //     contrast: Number(options[1].value),
  //     saturation: Number(options[2].value),
  //     grayscale: Number(options[3].value),
  //     blur: Number(options[6].value),
  //   };
  //   axios
  //     .get("http://localhost:5000/canvas/newimage", { params: params })
  //     .then((res) => {
  //       // console.log(res)
  //     });
  // };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = ToCanvas.url;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      console.log(canvas.width, canvas.height)
    };
    console.log(image, canvas, canvasRef);
  }, [ToCanvas.url]);

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
                style={getImageStyle()}
              />
            </div>
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
              {/* <button onClick={newImageUrl}>저장하기</button> */}
            </div>
            <Slider
              min={selectedOption.range.min}
              max={selectedOption.range.max}
              value={selectedOption.value}
              handleChange={handleSliderChange}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Canvas;
