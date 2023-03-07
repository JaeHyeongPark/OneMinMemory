import { useDrag } from "react-dnd";
import { useEffect, useContext } from "react";
import ImageContext from "./ImageContext";
import { DraggingContext } from "../../../pages/DraggingContext";

const Picture = (props) => {
  const ToCanvas = useContext(ImageContext);
  const { picDrag, ChangePicDrag } = useContext(DraggingContext);

  // upload, effect 이미지들 드래그
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "image",
      item: { url: props.url, type: "image" },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [props.url]
  );

  useEffect(() => {
    ChangePicDrag(isDragging);
    console.log("picDrag : ", picDrag);
  }, [isDragging]);

  // 이미지 클릭시 이벤트트
  const selectimage = async (url) => {
    if (props.mode === "Original") {
      const origin = { ...ToCanvas.origin };
      origin[url] = origin[url] ? 0 : 1;
      ToCanvas.setorigin(origin);
    } else {
      const effect = { ...ToCanvas.effect };
      effect[url] = effect[url] ? 0 : 1;
      ToCanvas.seteffect(effect);
    }
  };

  return (
    <img
      ref={drag}
      key={props.url}
      className={props.className}
      src={props.url}
      alt="a"
      style={{ border: isDragging && "5px solid yellow" }}
      onClick={() => selectimage(props.url)}
    />
  );
};
export default Picture;
