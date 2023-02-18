import React from "react";
import Transition from "./Transition";
const TransitionList = () => {};

<div className="transition-modal">
  {TRANSITION_LIST.map((transition, index) => {
    return (
      <Transition
        className={transition}
        key={index}
        // selectTransition={transition} // 이 부분 어떤 함수?
        onChange={transitionClipUpload}
      />
    );
  })}
  {transitionClip && (
    <video id="transition-clip" width="300" height="200" controls></video>
  )}
</div>;
