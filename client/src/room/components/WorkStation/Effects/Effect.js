import React, { useState, useEffect, useContext } from "react";
import { useDrag } from "react-dnd";
import "./Effect.css";
import { DraggingContext } from "../../../pages/DraggingContext";

const Effect = ({ className }) => {
  const [check, setcheck] = useState(false);
  const { effectDrag, ChangeEffectDrag } = useContext(DraggingContext);

  // effect 드랍존
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "effect",
    item: { className, type: "effect" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    ChangeEffectDrag(isDragging);
  }, [isDragging]);
  
  return (
    <div
      ref={dragRef}
      id="effect"
      className={className}
      style={{ opacity: isDragging ? "0.3" : "1" }}
      onMouseOver={() => setcheck(true)}
      onMouseOut={() => setcheck(false)}>
      <img
        className={className}
        src={check ? `/EffectList/gif/${className}.gif` : `/EffectList/image/${className}.jpg`}
        alt="effect"
      />
    </div>
  );
};

export default Effect;
