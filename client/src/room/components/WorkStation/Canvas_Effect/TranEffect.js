import Effect from "../Effects/Effect";
import Transition from "../Transitions/Transition";

import Button from "@mui/material/Button";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { Tooltip } from "@mui/material";

const EFFECT_LIST = [
  "ZoomIn_Center",
  "ZoomIn_TopLeft",
  "ZoomIn_TopRight",
  "ZoomIn_BottomLeft",
  "ZoomIn_BottomRight",
  "ZoomOut_Center",
  "ZoomOut_TopLeft",
  "ZoomOut_TopRight",
  "ZoomOut_BottomLeft",
  "ZoomOut_BottomRight",
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

const TranEffect = (props) => {
  const check = (e) => {
    e.preventDefault();
    if (props.traneffect === false) {
      props.check("transitionModal");
      props.mode(true);
    } else {
      props.mode(false);
    }
  };

  return (
    <>
      <Tooltip title="영상 효과" placement="top" arrow>
        <Button
          sx={
            props.traneffect && {
              bgcolor: "#ffd166",
              borderRadius: "15px",
              "&:hover": {
                backgroundColor: "#ffd166",
              },
            }
          }
          className="sidebar-item"
          name="Transition/Effect"
          onClick={check}
          startIcon={
            <AddLinkIcon
              style={{
                fontSize: 35,
                color: props.traneffect ? "#17171e" : "#ffd166",
              }}
            />
          }
        ></Button>
      </Tooltip>
      {props.traneffect && (
        <div className="transition-modal">
          <div className="effect-modal">
            <div className="effect-list">
              {EFFECT_LIST.map((effect, index) => {
                return <Effect className={effect} key={index} />;
              })}
            </div>
          </div>
          <div className="v-line"></div>
          <div className="transition-list">
            {TRANSITION_LIST.map((transition, index) => {
              return <Transition className={transition} key={index} />;
            })}
          </div>
        </div>
      )}
    </>
  );
};
export default TranEffect;
