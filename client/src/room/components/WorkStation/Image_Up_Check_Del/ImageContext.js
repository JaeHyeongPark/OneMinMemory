import React, { useState } from "react";
import { createContext } from "react";
import axios from "axios";

const ImageContext = createContext({
  url: "",
  type: "",
  view: {},
  sendurl: (url) => {},
  setView: (view) => {},
});

export const TocanvasProvider = (props) => {
  const [url, seturl] = useState("");
  const [type, settype] = useState("");
  const [view, setView] = useState({});

  const sendurl = (url) => {
    axios
      .post("http://chjungle.shop/api/canvas/imageinfo", { url: url })
      .then(async (res) => {
        settype(res.data.type);
        seturl(url);
      });
  };

  const ChangeView = (newView) => {
    setView(newView);
  };

  const imagetocanvas = {
    url: url,
    type: type,
    view: view,
    sendurl: sendurl,
    setView: ChangeView,
  };
  return (
    <ImageContext.Provider value={imagetocanvas}>
      {props.children}
    </ImageContext.Provider>
  );
};
export default ImageContext;
