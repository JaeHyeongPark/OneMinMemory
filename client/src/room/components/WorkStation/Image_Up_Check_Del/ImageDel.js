import axios from "axios";
import trash from "../../../assets/trash.svg";
import { useContext } from "react";
import ImageContext from "./ImageContext";
import App from "../../../../App.js";

const ImageDel = (props) => {
  const ToCanvas = useContext(ImageContext);
  const mode = props.mode;

  const deleteImage = (e) => {
    e.preventDefault();
    axios
      .post("https://chjungle.shop/api/photoBox/deleteimage", { mode: mode })
      .then((res) => {
        ToCanvas.setView(res.data);
        App.mainSocket.emit("pictureDelete", {
          Id: App.mainSocket.id,
          roomId: App.roomId,
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="delete_button" onClick={deleteImage}>
      <img src={trash} className="img.trash" alt="a" />
    </div>
  );
};
export default ImageDel;
