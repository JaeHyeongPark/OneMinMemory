import React, { useState } from "react";
import { createContext } from "react";

import axios from "axios";

// 업로드, 오리진,이펙트 사진들 관리 컨텍스트
const ImageContext = createContext({
  url: "",
  type: "",
  view:{},
  origin:{},
  effect:{},
  setorigin: (urllist) => {},
  seteffect: (urllist) => {},
  sendurl: (url) => {},
  setView: (view) => {}
});

export const TocanvasProvider = (props) => {
  const [url, seturl] = useState("");
  const [type, settype] = useState("");
  const [view, setView] = useState({})
  const [origin, setorigin] = useState({})
  const [effect, seteffect] = useState({})

  const sendurl = (url) => {
    axios
      .post("http://localhost:5000/canvas/imageinfo", { url: url })
      .then(async (res) => {
        settype(res.data.type);
        seturl(url);
      });
  };

  const ChangeView =(newView) => {
    setView(newView)
  }
  const Changeorigin =(newView) => {
    setorigin(newView)
  }
  const Changeeffect =(newView) => {
    seteffect(newView)
  }

  const imagetocanvas = {
    url: url,
    type: type,
    view:view,
    origin:origin,
    effect:effect,
    setorigin,Changeorigin,
    seteffect:Changeeffect,
    sendurl: sendurl,
    setView:ChangeView
  };
  return (
    <ImageContext.Provider value={imagetocanvas}>
      {props.children}
    </ImageContext.Provider>
  );
};
export default ImageContext;
