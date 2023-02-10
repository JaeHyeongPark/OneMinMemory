// import React, { useState, useRef, useEffect } from "react";
// import "./Canvas.css";

// const Canvas = () => {
//   const [brightness, setBrightness] = useState(100);
//   const [blur, setBlur] = useState(0);
//   const [greyscale, setGreyscale] = useState(0);
//   const [hue, setHue] = useState(0);
//   const [saturation, setSaturation] = useState(1);
//   const canvasRef = useRef(null);
//   const imageRef = useRef(null);
//   const [imageSrc, setImageSrc] = useState("");

//   useEffect(() => {
//     if (!imageSrc) return;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const img = imageRef.current;

//     canvas.width = img.width;
//     canvas.height = img.height;
//     ctx.drawImage(img, 0, 0);

//     ctx.filter = `brightness(${brightness}%) blur(${blur}px) grayscale(${greyscale}%) hue-rotate(${hue}deg) saturate(${saturation})`;
//   }, [brightness, blur, greyscale, hue, saturation, imageSrc]);

//   const handleImageChange = (e) => {
//     e.preventDefault();

//     const reader = new FileReader();
//     const file = e.target.files[0];

//     reader.onload = () => {
//       setImageSrc(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleReset = () => {
//     setBrightness(100);
//     setBlur(0);
//     setGreyscale(0);
//     setHue(0);
//     setSaturation(1);
//   };

//   return (
//     <div className="SelectedPhoto">
//       <div className="Tools">
//         <ul>
//           <li>
//             <i className="bx bxs-brightness-half"></i>
//             <p>Brightness</p>
//           </li>
//           <li>
//             <i className="bx bxs-brush"></i>
//             <p>Blur</p>
//           </li>
//           <li>
//             <i className="bx bxs-collection"></i>
//             <p>GreyScale</p>
//           </li>
//           <li>
//             <i className="bx bxs-color-fill"></i>
//             <p>Hue Rotate</p>
//           </li>
//           <li>
//             <i className="bx bxs-magic-wand"></i>
//             <p>Saturation</p>
//           </li>
//         </ul>
//       </div>
//       <div className="content">
//         <div className="choose_image">
//           <div className="upload_img_box">
//             <input
//               type="file"
//               name="selectedImage"
//               accept="image/jpg, image/jpeg, image/png"
//               onChange={handleImageChange}
//               ref={imageRef}
//             />
//             <p id="hint">Image Background</p>
//           </div>
//         </div>
//         <div className="preview_img_box">
//           <canvas ref={canvasRef} />
//           {imageSrc && <img ref={imageRef} src={imageSrc} alt="Selected" />}
//         </div>
//         <canvas id="image_canvas"></canvas>

//         <div className="image_holder">
//           <button className="remove_img_box">
//             <i className="bx bxs-message-square-x"></i>
//           </button>
//           <img src="" alt="img" id="image" />
//         </div>

//         <div className="options">
//           <div className="option">
//             <p>Brightness</p>
//             <input
//               type="range"
//               min={0}
//               max={200}
//               value={brightness}
//               id="brightness"
//               className="slider"
//               onChange={(e) => setBrightness(e.target.value)}
//             />
//           </div>
//           <div className="option">
//             <p>Blur</p>
//             <input
//               type="range"
//               min={0}
//               max={20}
//               value={blur}
//               id="blur"
//               className="slider"
//               onChange={(e) => setBlur(e.target.value)}
//             />
//           </div>
//           <div className="option">
//             <p>Greyscale</p>
//             <input
//               type="range"
//               min={0}
//               max={100}
//               value={greyscale}
//               id="greyscale"
//               className="slider"
//               onChange={(e) => setGreyscale(e.target.value)}
//             />
//           </div>
//           <div className="option">
//             <p>Hue</p>
//             <input
//               type="range"
//               min={0}
//               max={360}
//               value={hue}
//               id="hue"
//               className="slider"
//               onChange={(e) => setHue(e.target.value)}
//             />
//           </div>
//           <div className="option">
//             <p>Saturation</p>
//             <input
//               type="range"
//               min={0}
//               max={2}
//               step={0.1}
//               value={saturation}
//               id="saturation"
//               className="slider"
//               onChange={(e) => setSaturation(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       <button id="clearAll" onClick={handleReset}>
//         Reset
//       </button>
//     </div>
//   );
// };

// export default Canvas;

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

  console.log(getImageStyle());

  return (
    <div className="SelectedPhoto">
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
  );
}

export default Canvas;
