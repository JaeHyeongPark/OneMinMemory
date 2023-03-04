import { useContext } from "react";
import ImageContext from "./ImageContext";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import trash from "../../../assets/trash-icon.svg";

const ImageDel = (props) => {
  const ToCanvas = useContext(ImageContext);
  const mode = props.mode;

  const deleteImage = (e) => {
    e.preventDefault();
    if (mode === "Original") {
      const origin = {};
      Object.keys(ToCanvas.origin).filter((url) => {
        if (ToCanvas.origin[url] === 0) {
          origin[url] = 0;
        }
      });
      ToCanvas.setorigin(origin);
    } else {
      const effect = {};
      console.log(ToCanvas.effect);
      Object.keys(ToCanvas.effect).filter((url) => {
        if (ToCanvas.effect[url] === 0) {
          effect[url] = 0;
        }
      });
      ToCanvas.seteffect(effect);
    }
  };

  return (
    <Button
      className="delete_button"
      variant="outlined"
      component="label"
      sx={{ width: "100%", height: "100%" }}
      onClick={deleteImage}
    >
      <img src={trash} className="trash-img" alt="delete"></img>
    </Button>
  );
};
export default ImageDel;
