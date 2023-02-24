import React from "react";
import { useDrag } from "react-dnd";
import "./Effect.css";

const Effect = ({ className }) => {
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
    >
      <img
        className={className}
        src="/EffectList/Effect.jpg"
        alt="effect"
      />
      <div className="effect-title">{className}</div>
    </div>
  );
};

export default Effect;
