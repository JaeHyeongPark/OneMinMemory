import { useDrag } from "react-dnd";
import { useContext } from "react";
import ImageContext from "./ImageContext";
import axios from "axios";

const Picture = (props) => {
  const ToCanvas = useContext(ImageContext);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "image",
      item: { url: props.url },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [props.url]
  );

  const selectimage = async (url) => {
    axios
      .post("https://chjungle.shop/api/photoBox/clickimage", {
        url: props.url,
        mode: props.mode,
      })
      .then((res) => {
        ToCanvas.setView(res.data);
      });
  };

  return (
    <img
      ref={drag}
      key={props.url}
      className={props.className}
      src={props.url}
      alt="a"
      style={{ border: isDragging && "5px solid pink" }}
      onClick={() => selectimage(props.url)}
    />
  );
};
export default Picture;
