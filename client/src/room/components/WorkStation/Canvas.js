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
  const [TextMode, setTextMode] = useState(false);
  const [inputShow, setinputShow] = useState(false);
  const [PaintMode, setPaintMode] = useState(false);
  const [Paint, setPaint] = useState(false);
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
      Ctx.font = "14px sans-serif";
      Ctx.fillText(e.target.value, x[0], y[0]);
      setinputShow(false);
      setTextMode(false);
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

  const handleSubmit = async () => {
    const version =
      "4f88a16a13673a8b589c18866e540556170a5bcb2ccdc12de556e800e9456d3d";
    const input = {
      frame1:
        "https://images.unsplash.com/photo-1503424886307-b090341d25d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2076&q=80",
      frame2:
        "https://images.unsplash.com/uploads/14116941824817ba1f28e/78c8dff1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80",
    };
    const data = { version, input };
    const headers = {
      Authorization: "Token 219de58e9593d4a8c3556a26ffeb5964650cc0f2",
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        "https://api.replicate.com/v1/predictions",
        data,
        { headers }
      );
      const prediction = response.data;
      console.log(prediction);
      return prediction;
    } catch (error) {
      console.error(error);
      return null;
    }
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
                  }}
                  onKeyDown={handleEnter}
                />
              )}
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
              <button
                className="sidebar-item"
                onClick={() => {
                  setTextMode(TextMode ? false : true);
                }}
              >
                Text Mode-{TextMode ? "END" : "Write"}
              </button>
              <button className="sidebar-item" onClick={newImage}>
                저장하기
              </button>
              <button className="sidebar-item" onClick={handleSubmit}>
                Frame Interpolation
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Canvas;
