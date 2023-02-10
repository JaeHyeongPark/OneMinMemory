import React from "react";

import "./Canvas.css";

const Canvas = () => {
  return (
    <React.Fragment>
      <div className="Username_and_canvas">
        <div className="Username">
          <span className="USER_canvan_span">USER1의 캔버스</span>
        </div>
        <canvas></canvas>
      </div>
    </React.Fragment>
  );
};

export default Canvas;
