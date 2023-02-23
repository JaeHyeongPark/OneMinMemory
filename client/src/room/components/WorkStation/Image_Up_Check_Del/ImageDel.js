import trash from "../../../assets/trash.svg";
import { useContext } from "react";
import ImageContext from "./ImageContext";

const ImageDel = (props) => {
  const ToCanvas = useContext(ImageContext);
  const mode = props.mode

  const deleteImage = (e) => {
    e.preventDefault();
    if (mode === "Original"){
      const origin = {}
      Object.keys(ToCanvas.origin).filter((url) => {
        if (ToCanvas.origin[url] === 0){
          origin[url] = 0
        }
      })
      ToCanvas.setorigin(origin)
    }else{
      const effect = {}
      console.log(ToCanvas.effect)
      Object.keys(ToCanvas.effect).filter((url) => {
        if (ToCanvas.effect[url] === 0){
          effect[url] = 0
        }
      })
      ToCanvas.seteffect(effect)
    }
  };

  return (
    <div className="delete_button" onClick={deleteImage}>
      <img src={trash} className="img.trash" alt="a" />
    </div>
  );
};
export default ImageDel;
