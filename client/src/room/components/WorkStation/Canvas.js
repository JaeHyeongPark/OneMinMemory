import React, { useState, useRef } from "react";

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
  const [imgFile, setImgFile] = useState("");
  const imgRef = useRef();

  const saveImgFile = (e) => {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = () => {
      setImgFile(reader.result);
    };
    reader.readAsDataURL(file);
  };

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

  return (
    <React.Fragment>
      <div className="Username_and_canvas">
        <div className="Username">
          <span className="USER_canvan_span">USER1의 캔버스</span>
        </div>
        <div className="canvas">
          <div className="container">
            <label className="main-image" htmlFor="main-image">
              업로드
              <div className="uploaded-image">
                <img src={imgFile} alt="uploaded" style={getImageStyle()} />
              </div>
            </label>
            <input
              className="image-input"
              type="file"
              accept="image/*"
              onChange={saveImgFile}
            />
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
