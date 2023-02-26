import React, { useState } from "react";
import { useDrag } from "react-dnd";
import "./Transition.css";

const Transition = ({ className, onChange }) => {
  const [check, setcheck] = useState(false);
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "transition",
    item: { className },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      id="transition"
      className={className}
      style={{ opacity: isDragging ? "0.3" : "1" }}
      onMouseOver={() => setcheck(true)}
      onMouseOut={() => setcheck(false)}
    >
      <img
        className={className}
        src={
          check
            ? `/TransitionList/${className}.gif`
            : "/TransitionList/profile.jpeg"
        }
        alt="transition"
      />
      <div className="transition-title">{className}</div>
    </div>
  );
};

export default Transition;
