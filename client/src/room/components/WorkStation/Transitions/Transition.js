import React from "react";
import { useDrag } from "react-dnd";

const Transition = ({ className, selectTransition }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "transition",
    item: { className },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (className, monitor) => {},
  }));
  return (
    <div
      ref={dragRef}
      key={className}
      className={className}
      style={{ opacity: isDragging ? "0.3" : "1" }}
    >
      {className}
    </div>
  );
};

export default Transition;
