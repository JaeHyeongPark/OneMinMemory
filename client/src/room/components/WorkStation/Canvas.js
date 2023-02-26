import React, { useState, useContext, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import ImageContext from "./Image_Up_Check_Del/ImageContext";
import axios from "axios";
import { useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import AutoFixNormalOutlinedIcon from "@mui/icons-material/AutoFixNormalOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import TextFieldsOutlinedIcon from "@mui/icons-material/TextFieldsOutlined";
import AddLinkIcon from "@mui/icons-material/AddLink";
import SaveIcon from "@mui/icons-material/Save";

import "./Canvas.css";
import Effect from "./Effects/Effect";
import Transition from "./Transitions/Transition";
import App from "../../../App";

const EFFECT_LIST = [
  "zoom_in",
  // "zoom_out",
  "zoom_top_left",
  "zoom_top_right",
  "zoom_bottom_left",
  "zoom_bottom_right",
];

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
  "wipeleft",
  "wiperight",
];

function Canvas() {
  const canvasRef = useRef(null);
  const [TextMode, setTextMode] = useState(false);
  const [inputShow, setinputShow] = useState(false);
  const [PaintMode, setPaintMode] = useState(false);
  const [Paint, setPaint] = useState(false);
  const [modalcheck, setmodalcheck] = useState(true);
  const [effectModal, setEffectModal] = useState(false);
  const [transitionModal, setTransitionModal] = useState(false);
  const [Ctx, setCtx] = useState(null);
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const [transitionClip, setTransitionClip] = useState(false);
  const [showEffectItems, setShowEffectItems] = useState(false);
  const effectItemsRef = useRef(null);
  const roomId = useParams().roomId;
  const ToCanvas = useContext(ImageContext);

  const [{ isover }, drop] = useDrop(() => ({
    accept: ["image"],
    drop: (item) => imageToCanvas(item.url),
    collect: (monitor) => ({
      isover: monitor.isOver(),
    }),
  }));
  const [{ isOver }, modal] = useDrop(() => ({
    accept: ["image"],
    drop: (item) => changeModalToCanvas(item.url),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const changeModalToCanvas = (url) => {
    setEffectModal(false);
    setTransitionModal(false);
    ToCanvas.sendurl(url);
    setmodalcheck(!modalcheck);
  };

  const imageToCanvas = (url) => {
    ToCanvas.sendurl(url);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.style = {};
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCtx(ctx);

    const image = new Image();
    image.src = ToCanvas.url;
    image.crossOrigin = "*";
    image.onload = () => {
      Ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      Ctx.lineJoin = "round";
      Ctx.lineWidth = 6;
    };
  }, [ToCanvas.url, Ctx, modalcheck]);

  const drawing = (e) => {
    const x = e.nativeEvent.offsetX * (1280 / 768);
    const y = e.nativeEvent.offsetY * (720 / 432);
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
    setX([x * (1280 / 768), z.x + x]);
    setY([y * (720 / 432), z.y + y - 12]);
    setinputShow(true);
  };

  const handleEnter = (e) => {
    const code = e.keyCode;
    if (code === 13) {
      Ctx.textBaseline = "top";
      Ctx.textAlign = "left";
      Ctx.font = "35px fantasy";
      Ctx.fillText(e.target.value, x[0], y[0]);
      setinputShow(false);
      setTextMode(false);
    }
  };

  const newImage = async (e) => {
    // e.preventDefault();
    const imagedata = await canvasRef.current.toDataURL(
      "image/" + ToCanvas.type
    );
    const formdata = new FormData();
    formdata.append("imagedata", imagedata);
    formdata.append("originurl", ToCanvas.url);
    formdata.append("roomid", roomId);
    formdata.append("id", App.mainSocket.id);

    //checked
    await axios
      .post(process.env.REACT_APP_expressURL + "/canvas/newimage", formdata, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success !== true) {
          console.log("응답에러");
          return;
        }
        // 수정한 사진 저장하면 새로운 캔버스를 깔아준다.
        const canvas = canvasRef.current;
        canvas.style = {};
        Ctx.clearRect(0, 0, canvas.width, canvas.height);
      })
      .catch((err) => {
        console.log(err);
        console.log("에러!");
      });
  };

  const selectedOptionApply = async (name) => {
    console.log("name:", name);
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/" + ToCanvas.type);
    // checkpoint!
    const formdata = new FormData();
    formdata.append(`${name}ImageData`, imageData);
    formdata.append("roomid", roomId);
    await axios
      .post(
        process.env.REACT_APP_expressURL + `/canvas/image/${name}`,
        formdata,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
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
        <div className="EditButtons">
          <Button
            className="sidebar-item"
            name="Canvas Effect"
            onClick={() => setShowEffectItems(!showEffectItems)}
            startIcon={<AutoFixNormalOutlinedIcon style={{ fontSize: 35 }} />}
          ></Button>
          {showEffectItems ? (
            <ul className="canvaseffect__items" ref={effectItemsRef}>
              <li>
                <Button
                  className="sidebar-item"
                  name="Brighten"
                  onClick={() => selectedOptionApply("Brighten")}
                >
                  Brighten
                </Button>
              </li>
              <li>
                <Button
                  className="sidebar-item"
                  name="Sharpen"
                  onClick={() => selectedOptionApply("Sharpen")}
                >
                  Sharpen
                </Button>
              </li>
              <li>
                <Button
                  className="sidebar-item"
                  name="Saturate"
                  onClick={() => selectedOptionApply("Saturate")}
                >
                  Saturate
                </Button>
              </li>
              <li>
                <Button
                  className="sidebar-item"
                  name="Grayscale"
                  onClick={() => selectedOptionApply("Grayscale")}
                >
                  Grayscale
                </Button>
              </li>
            </ul>
          ) : (
            <></>
          )}

          <Button
            className="sidebar-item"
            name="Paint Mode"
            onClick={() => {
              setPaintMode(PaintMode ? false : true);
            }}
            startIcon={<BorderColorOutlinedIcon style={{ fontSize: 35 }} />}
          ></Button>
          <Button
            className="sidebar-item"
            name="Text Mode"
            onClick={() => {
              setTextMode(TextMode ? false : true);
            }}
            startIcon={<TextFieldsOutlinedIcon style={{ fontSize: 35 }} />}
          ></Button>
          <Button
            className="sidebar-item"
            name="Transition/Effect"
            onClick={() => {
              setTransitionModal(!transitionModal);
            }}
            startIcon={<AddLinkIcon style={{ fontSize: 35 }} />}
          ></Button>
          <Button
            className="sidebar-item"
            onClick={newImage}
            name="Save"
            startIcon={<SaveIcon style={{ fontSize: 35 }} />}
          ></Button>
        </div>

        <div className="container">
          {!transitionModal ? (
            <div className="uploaded-image" ref={drop}>
              <canvas
                ref={canvasRef}
                width={1280}
                height={720}
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
            <div className="transition-modal" ref={modal}>
              <div className="effect-modal" ref={modal}>
                <div className="effect-list">
                  {EFFECT_LIST.map((effect, index) => {
                    return <Effect className={effect} key={index} />;
                  })}
                </div>
                <hr></hr>
              </div>
              <div className="transition-list">
                {TRANSITION_LIST.map((transition, index) => {
                  return <Transition className={transition} key={index} />;
                })}
              </div>
              <hr></hr>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Canvas;
