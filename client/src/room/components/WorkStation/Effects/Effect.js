import React, { useState } from "react";
import { useDrag } from "react-dnd";
import "./Effect.css";

const Effect = ({ className }) => {
  const [check, setcheck] = useState(false)
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "effect",
    item: { className, type: "effect" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  return (
    <div
      ref={dragRef}
      id="effect"
      className={className}
      style={{ opacity: isDragging ? "0.3" : "1" }}
      onMouseOver={() => setcheck(true)}
      onMouseOut={() => setcheck(false)}
    >
      <img
        className={className}
        src= {check ? `/EffectList/${className}.gif` : "/EffectList/Effect.jpg"}
        alt="effect"
      />
      <div className="effect-title">{className}</div>
    </div>
  );
};

export default Effect;
