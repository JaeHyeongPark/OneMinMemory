import Effect from "../Effects/Effect";
import Transition from "../Transitions/Transition";

import Button from "@mui/material/Button";
import AddLinkIcon from "@mui/icons-material/AddLink";

const EFFECT_LIST = [
  // "zoom_in",
  // "zoom_out",
  // "zoom_top_left",
  // "zoom_top_right",
  // "zoom_bottom_left",
  // "zoom_bottom_right",
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
      <Button
        className="sidebar-item"
        name="Transition/Effect"
        onClick={check}
        startIcon={<AddLinkIcon style={{ fontSize: 35 }} />}
      ></Button>
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
