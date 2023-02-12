import React, { useState, useRef, useContext } from "react";
import ImageContext from "./Image_Up_Check_Del/ImageContext";

import "./Canvas.css";
import Slider from "./Sliders";
import SidebarItem from "./SidebarItem";
import FrameInterpolation from "./FrameInterpolation";
import CanvasDraw from "react-canvas-draw";
import html2canvas from "html2canvas";

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
  const canvasRef = useRef();
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

  const onHtmlToPng = () => {
    const onSaveAs = (uri, filename) => {
      let link = document.createElement("a");
      document.body.appendChild(link);
      link.href = uri;
      link.download = filename;
      link.click();
      document.body.removeChild(link);
    };

    const onCapture = () => {
      html2canvas(document.getElementById("img_canvas")).then((canvas) => {
        onSaveAs(canvas.toDataURL("image/png"), "image-download.png");
      });
    };

    onCapture();
  };

  const applyInterpolation = () => {};

  return (
    <React.Fragment>
      <div className="Username_and_canvas">
        <div className="Username">
          <span className="USER_canvan_span">USER1의 캔버스</span>
        </div>
        <div className="canvas">
          <div className="container">
            <div className="uploaded-image">
              {ToCanvas.url ? (
                <img
                  src={ToCanvas.url}
                  alt="uploaded"
                  style={getImageStyle()}
                />
              ) : (
                <></>
              )}
              <CanvasDraw
                ref={canvasRef}
                canvasHeight={700}
                canvasWidth={500}
                brushRadius={3}
                lazyRadius={0}
                hideGrid={true}
                backgroundColor="none"
                style={{ position: "absolute", top: 0, left: 0 }}
              />
            </div>
            <button onClick={onHtmlToPng}>click!</button>

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
              <FrameInterpolation handleClick={() => applyInterpolation} />
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
