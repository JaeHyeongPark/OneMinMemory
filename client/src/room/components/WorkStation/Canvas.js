import React, { useState, useContext, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import ImageContext from "./Image_Up_Check_Del/ImageContext";
import axios from "axios";
import { useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import SnackBar from "../RoomHeader/SnackBar";
import { Tooltip } from "@mui/material";

import "./Canvas.css";
import App from "../../../App";
import Painting from "./Canvas_Effect/Painting";
import Text from "./Canvas_Effect/Text";
import EffectItems from "./Canvas_Effect/EffectItems";
import TranEffect from "./Canvas_Effect/TranEffect";
import { DraggingContext } from "../../pages/DraggingContext";

function Canvas() {
  // 캔버스 관련 훅
  const [Ctx, setCtx] = useState(null);
  const canvasRef = useRef(null);
  const ToCanvas = useContext(ImageContext);
  const roomId = useParams().roomId;

  // 캔버스 ctrl + z 버튼 관련 훅
  const [HistoryList, setHistoryList] = useState([]);
  const [Hisidx, setHisidx] = useState(0);

  // text 관련 훅
  const [TextMode, setTextMode] = useState(false);
  const [inputShow, setinputShow] = useState(false);
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const [textSize, settextSize] = useState(30);
  const [textfont, settextfont] = useState("fantasy");
  const [textColor, settextColor] = useState("black");

  // paint 관련 훅
  const [PaintMode, setPaintMode] = useState(false);
  const [Paint, setPaint] = useState(false);
  const [PaintPx, setPaintPX] = useState(5);
  const [PaintColor, setPaintColor] = useState("black");

  // effectitems, effect, transition 관련 훅
  const [transitionModal, setTransitionModal] = useState(false);
  const [showEffectItems, setShowEffectItems] = useState(false);

  // DraggingContext
  const { picDrag } = useContext(DraggingContext);

  // canvas버튼 관리(한번에 1개만 작동)
  const check = (onitem) => {
    if (onitem !== "TextMode") {
      setTextMode(false);
    }
    if (onitem !== "PaintMode") {
      setPaintMode(false);
    }
    if (onitem !== "transitionModal") {
      setTransitionModal(false);
    }
    if (onitem !== "showEffectItems") {
      setShowEffectItems(false);
    }
  };

  // 캔버스 드랍존
  const [{ isover }, drop] = useDrop(() => ({
    accept: ["image"],
    drop: (item) => imageToCanvas(item.url),
    collect: (monitor) => ({
      isover: monitor.isOver(),
    }),
  }));

  // 이미지 드래그 드랍으로 캔버스에 이미지 넣기
  const imageToCanvas = (url) => {
    ToCanvas.sendurl(url);
  };

  // 캔버스에 사진 띄우기(초기값 설정)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    canvas.style = {};
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCtx(ctx);

    const image = new Image();
    // image origin을 먼저 열어주고 src에서 이미지를 받는다.
    image.crossOrigin = "*";
    image.src = ToCanvas.url;
    image.onload = () => {
      Ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      // 새로운 그림을 작업할때 다른 사람에게 상태 전송
      const data = ctx.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      setHistoryList([data]);
      setHisidx(1);
      const imageData = canvasRef.current.toDataURL("image/" + ToCanvas.type);
      App.mainSocket.emit("myCanvas", { imageData });
    };
  }, [ToCanvas.url, Ctx]);

  // 캔버스 페인팅 작업 함수
  const drawing = (e) => {
    const resize_x = canvasRef.current.offsetWidth;
    const resize_y = canvasRef.current.offsetHeight;
    const x = e.nativeEvent.offsetX * (1280 / resize_x);
    const y = e.nativeEvent.offsetY * (720 / resize_y);
    if (Paint && PaintMode) {
      Ctx.lineJoin = "bevel";
      Ctx.lineCap = "round";
      Ctx.lineWidth = PaintPx;
      Ctx.strokeStyle = PaintColor;
      Ctx.lineTo(x, y);
      Ctx.stroke();
    } else {
      Ctx.beginPath();
      Ctx.moveTo(x, y);
    }
  };

  // 페인팅 작업 조건 판단
  const ChangePaint = async (check) => {
    if (!PaintMode) return;
    if (Paint && !check) {
      await ctrlStore();
    }
    if (check) {
      setPaint(check);
    } else {
      setPaint(check);
    }
  };

  // 텍스트 모드에서 마우스 클릭시 해당 위치에 input창 띄우기
  const addinput = (e) => {
    if (!TextMode) {
      return;
    }
    const resize_x = canvasRef.current.offsetWidth;
    const resize_y = canvasRef.current.offsetHeight;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const z = canvasRef.current.getBoundingClientRect();
    setX([x * (1280 / resize_x), z.x + x]);
    setY([y * (720 / resize_y) - textSize / 2, z.y + y - textSize / 2]);
    setinputShow(true);
  };

  // 텍스트 입력 완료시 호출(엔터키 누르면 작동)
  const handleEnter = async (e) => {
    const code = e.keyCode;
    if (code === 13) {
      Ctx.textBaseline = "top";
      Ctx.textAlign = "left";
      Ctx.font = `${textSize}px ${textfont}`;
      Ctx.fillStyle = textColor;
      Ctx.fillText(e.target.value, x[0], y[0]);

      await ctrlStore();
      setinputShow(false);
      setTextMode(false);
    }
  };

  // 캔버스 작업 후 저장했을때 호출되는 함수
  const newImage = async (e) => {
    if (ToCanvas.url === "") {
      SnackBar.canvasWarningOpen();
      return;
    }
    e.preventDefault();

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
        // 수정한 사진 저장후 같은 사진을 또 작업할 수 있게 캔버스 url초기화
        ToCanvas.Changeurl("");

        // 수정한 사진 저장하면 새로운 캔버스를 깔아준다.
        const canvas = canvasRef.current;
        canvas.style = {};
        Ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 사진을 저장후 빈 캔버스의 상태를 상대방에게 전송
        setHistoryList([]);
        setHisidx(0);
        ctrlStore();
      })
      .catch((err) => {
        console.log(err);
        console.log("에러!");
      });
  };

  // 이미지에 효과 넣어주는 함수
  const selectedOptionApply = async (name) => {
    console.log("name:", name);
    const canvas = canvasRef.current;
    const imageData = await canvas.toDataURL("image/" + ToCanvas.type);

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
          image.crossOrigin = "*";
          image.src = effectedImageData;
          image.onload = () => {
            Ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            ctrlStore();
          };
        }
      })
      .catch((err) => {
        console.log("this is error!!!");
      });
  };

  // Ctrl + Z 키 입력시 호출(window를 사용하여 창 전체에서 이벤트를 설정)
  useEffect(() => {
    const handleUndo = (e) => {
      if ((e.ctrlKey && e.key === "z") || (e.metaKey && e.key === "z")) {
        CtrlZ();
      }
      if (
        (e.ctrlKey && e.key === "y") ||
        (e.metaKey && e.key === "z" && e.shiftKey)
      ) {
        CtrlY();
      }
    };
    window.addEventListener("keydown", handleUndo);
    return () => {
      window.removeEventListener("keydown", handleUndo);
    };
  }, [HistoryList, Hisidx]);
  // Ctrl 훅들 값들이 바로바로 적용되기 위한 useeffect
  useEffect(() => {}, [HistoryList, Hisidx]);

  // Ctrl + z 키
  const CtrlZ = async () => {
    try {
      if (HistoryList.length !== 0 && Hisidx - 2 >= 0) {
        Ctx.putImageData(HistoryList[Hisidx - 2], 0, 0);
        setHisidx(Hisidx - 1);
        const imageData = await canvasRef.current.toDataURL(
          "image/" + ToCanvas.type
        );
        App.mainSocket.emit("myCanvas", { imageData });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Ctrl + y 키
  const CtrlY = async () => {
    try {
      if (HistoryList.length !== 0 && Hisidx < HistoryList.length) {
        Ctx.putImageData(HistoryList[Hisidx], 0, 0);
        setHisidx(Hisidx + 1);
        const imageData = await canvasRef.current.toDataURL(
          "image/" + ToCanvas.type
        );
        App.mainSocket.emit("myCanvas", { imageData });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Ctrl키를 위한 이전 작업 저장
  const ctrlStore = async () => {
    try {
      const data = await Ctx.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      let list = HistoryList.slice(0, Hisidx);
      list.push(data);
      setHistoryList(list);
      setHisidx(list.length);

      // 현재 작업물의 base64데이터 URL
      const imageData = await canvasRef.current.toDataURL(
        "image/" + ToCanvas.type
      );
      App.mainSocket.emit("myCanvas", { imageData });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <React.Fragment>
      <div className="Username_and_canvas">
        <div className="EditButtons">
          <EffectItems
            itemsmode={showEffectItems}
            mode={setShowEffectItems}
            apply={selectedOptionApply}
            check={check}
          />
          <Painting
            paintmode={PaintMode}
            mode={setPaintMode}
            px={setPaintPX}
            color={setPaintColor}
            check={check}
          />
          <Text
            textmode={TextMode}
            mode={setTextMode}
            px={settextSize}
            color={settextColor}
            font={settextfont}
            check={check}
          />
          <TranEffect
            traneffect={transitionModal}
            mode={setTransitionModal}
            check={check}
          />
          <Tooltip title="저장하기" placement="top" arrow>
            <Button
              className="sidebar-item"
              onClick={newImage}
              name="Save"
              startIcon={<SaveIcon style={{ fontSize: 35 }} />}
            ></Button>
          </Tooltip>
        </div>
        <div
          className="uploaded-image"
          ref={drop}
          style={{
            border: picDrag && "2px solid #1484CD",
            boxShadow:
              picDrag &&
              "0 0 2px #1484CD, 0 0 2px #1484CD, 0 0 20px #1484CD, 0 0 8px #1484CD, 0 0 28px #1484CD, inset 0 0 13px #1484CD",
          }}
        >
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
                height: `${textSize}px`,
              }}
              onKeyDown={handleEnter}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Canvas;
