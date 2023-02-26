import { useRef, useState } from "react";

import Button from "@mui/material/Button";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

const Painting = (props) => {
  const lineColor = useRef(props.PC);
  const [linePx, setlinePx] = useState(5);

  const changepx = (e) => {
    e.preventDefault();
    setlinePx(e.target.value);
  };

  const changecolor = (e) => {
    e.preventDefault();
    props.color(lineColor.current.value);
  };

  return (
    <>
      <Button
        className="sidebar-item"
        name="Paint Mode"
        onClick={() => {
          props.mode(props.paintmode ? false : true);
        }}
        startIcon={<BorderColorOutlinedIcon style={{ fontSize: 35 }} />}
      ></Button>
      {props.paintmode && (
        <ul className="canvaseffect__items">
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
            <span style={{ color: "white" }}>{`${linePx}px`}</span>
          </li>
          <li>
            <input
              type="color"
              value="red"
              ref={lineColor}
              onChange={changecolor}
            />
          </li>
        </ul>
      )}
    </>
  );
};
export default Painting;
