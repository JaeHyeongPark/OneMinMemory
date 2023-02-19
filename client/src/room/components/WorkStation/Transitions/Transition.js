import React from "react";
import { useDrag } from "react-dnd";
import "./Transition.css";

const Transition = ({ className, onChange }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "transition",
    item: { className },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    // end: (className, monitor) => {},
  }));
  return (
    <div
      ref={dragRef}
      id="transition"
      onClick={onChange}
      className={className}
      style={{ opacity: isDragging ? "0.3" : "1" }}
    >
      <img
        className={className}
        src="/TransitionList/profile.jpeg"
        alt="transition"
        onClick={onChange}
      />
      <div className="transition-title">{className}</div>
    </div>
  );
};

export default Transition;
