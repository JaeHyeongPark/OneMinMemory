import React, { useState } from "react";
import { createContext } from "react";

// 드래그 객체 - Picture, Effect, Trans 의 isDragging 값을
// 전역으로 선언하기위한 Context
export const DraggingContext = createContext();

export const DraggingProvider = (props) => {
  const [picDrag, setPicDrag] = useState(false);
  const [effectDrag, setEffectDrag] = useState(false);
  const [transDrag, setTransDrag] = useState(false);

  const ChangePicDrag = () => setPicDrag((v) => !v);
  const ChangeEffectDrag = () => setEffectDrag((v) => !v);
  const ChangeTransDrag = () => setTransDrag((v) => !v);

  const dragtodrop = {
    picDrag,
    effectDrag,
    transDrag,
    ChangePicDrag,
    ChangeEffectDrag,
    ChangeTransDrag,
  };
  return (
    <DraggingContext.Provider value={dragtodrop}>
      {props.children}
    </DraggingContext.Provider>
  );
};
