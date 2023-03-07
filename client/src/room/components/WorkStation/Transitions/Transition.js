import React, { useState, useEffect, useContext } from "react";
import { useDrag } from "react-dnd";
import "./Transition.css";
import { DraggingContext } from "../../../pages/DraggingContext";

const Transition = ({ className, onChange }) => {
  const [check, setcheck] = useState(false);
  const { transDrag, ChangeTransDrag } = useContext(DraggingContext);

  // transition 드래그
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "transition",
    item: { className },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    ChangeTransDrag(isDragging);
  }, [isDragging]);

  return (
    <div
      ref={dragRef}
      id="transition"
      className={className}
      style={{ opacity: isDragging ? "0.3" : "1" }}
      onMouseOver={() => setcheck(true)}
      onMouseOut={() => setcheck(false)}>
      <img
        className={className}
        src={
          check
            ? `/TransitionList/gif/${className}.gif`
            : `/TransitionList/image/${className}.jpg`
        }
        alt="transition"
      />
      {/* <div className="transition-title">{className}</div> */}
    </div>
  );
};

export default Transition;
