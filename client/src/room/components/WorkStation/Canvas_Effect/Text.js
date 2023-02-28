import { useState, useRef } from "react";

import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextFieldsOutlinedIcon from "@mui/icons-material/TextFieldsOutlined";

const Text = (props) => {
  const [font, setFont] = useState("");
  const [linePx, setlinePx] = useState(30);
  const lineColor = useRef('black');

  const handleChange = (e) => {
    e.preventDefault();
    setFont(e.target.value);
    props.font(e.target.value);
  };

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
    if (props.textmode === false) {
      props.check("TextMode");
      props.mode(true);
    } else {
      props.mode(false);
    }
  };

  return (
    <>
      <Button
        className="sidebar-item"
        name="Text Mode"
        onClick={check}
        startIcon={<TextFieldsOutlinedIcon style={{ fontSize: 35 }} />}
      ></Button>
      {props.textmode && (
        <ul className="canvaseffect__items">
          <li>
            <input
              type="range"
              min="1"
              max="150"
              value={linePx}
              onChange={changepx}
              onMouseUp={() => {
                props.px(linePx);
              }}
            />
            <span style={{ color: "white" }}>{`${linePx}px`}</span>
          </li>
          <li>
            <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
              <InputLabel id="demo-select-small">Font</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={font}
                label="Font"
                onChange={handleChange}
                autoWidth
                style={{ fontFamily: font }}
              >
                <MenuItem
                  value={"system-ui"}
                  style={{ fontFamily: "system-ui" }}
                >
                  system-ui123
                </MenuItem>
                <MenuItem value={"Georgia"} style={{ fontFamily: "Georgia" }}>
                  Georgia123
                </MenuItem>
                <MenuItem value={"cursive"} style={{ fontFamily: "cursive" }}>
                  cursive123
                </MenuItem>
                <MenuItem value={"fantasy"} style={{ fontFamily: "fantasy" }}>
                  fantasy123
                </MenuItem>
                <MenuItem
                  value={"monospace"}
                  style={{ fontFamily: "monospace" }}
                >
                  monospace123
                </MenuItem>
                <MenuItem value={"math"} style={{ fontFamily: "math" }}>
                  math123
                </MenuItem>
                <MenuItem value={"Times"} style={{ fontFamily: "Times" }}>
                  Times123
                </MenuItem>
                <MenuItem value={"굴림 "} style={{ fontFamily: "굴림" }}>
                  굴림123
                </MenuItem>
                <MenuItem value={"바탕 "} style={{ fontFamily: "바탕" }}>
                  바탕123
                </MenuItem>
                <MenuItem value={"궁서 "} style={{ fontFamily: "궁서" }}>
                  궁서123
                </MenuItem>
              </Select>
            </FormControl>
          </li>
          <li>
            <input
              type="color"
              ref={lineColor}
              onChange={changecolor}
            />
          </li>
        </ul>
      )}
    </>
  );
};
export default Text;
