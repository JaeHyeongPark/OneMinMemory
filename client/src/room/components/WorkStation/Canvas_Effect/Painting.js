import { useRef, useState } from "react";

import Button from "@mui/material/Button";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { Tooltip } from "@mui/material";

const Painting = (props) => {
  const lineColor = useRef("black");
  const [linePx, setlinePx] = useState(5);

  const changepx = (e) => {
    e.preventDefault();
    setlinePx(e.target.value);
  };

  const changecolor = (e) => {
    e.preventDefault();
    props.color(lineColor.current.value);
  };

  const check = (e) => {
    e.preventDefault();
    if (props.paintmode === false) {
      props.check("PaintMode");
      props.mode(true);
    } else {
      props.mode(false);
    }
  };

  return (
    <>
      <Tooltip title="그리기" placement="top" arrow>
        <Button
          sx={
            props.paintmode && {
              bgcolor: "#ffd166",
              borderRadius: "15px",
              "&:hover": {
                backgroundColor: "#ffd166",
              },
            }
          }
          className="sidebar-item"
          name="Paint Mode"
          onClick={check}
          startIcon={
            <BorderColorOutlinedIcon
              style={{
                fontSize: 35,
                color: props.paintmode ? "#17171e" : "#ffd166",
              }}
            />
          }
        ></Button>
      </Tooltip>
      {props.paintmode && (
        <div className="canvaseffect__items__painting">
          <li>
            <input
              type="range"
              min="1"
              max="10"
              value={linePx}
              onChange={changepx}
              onMouseUp={() => {
                props.px(linePx);
              }}
            />
            <span style={{ color: "white" }}>{` ${linePx}px`}</span>
          </li>
          <li>
            <input type="color" ref={lineColor} onChange={changecolor} />
          </li>
        </div>
      )}
    </>
  );
};
export default Painting;
