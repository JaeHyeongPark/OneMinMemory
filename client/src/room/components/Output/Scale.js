import React from "react";
import Tik from "./Tik";

import "./Output.css";

const Scale = () => {
  let scale = [];

  for (let i = 0; i < 61; i++) {
    if (i === 0) {
      scale.push(<Tik time={i} src="A" />);
    } else if (i % 10 === 0) {
      scale.push(<Tik time={i} src="A" />);
    } else if (i % 5 === 0) {
      scale.push(<Tik time={i} src="B" />);
    } else {
      scale.push(<Tik time={i} src="C" />);
    }
  }
  return (
    <>
      {scale}
    </>
  );
};

export default Scale;
