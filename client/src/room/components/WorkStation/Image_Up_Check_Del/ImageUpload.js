import axios from "axios";
import { useContext } from "react";
import ImageContext from "./ImageContext";
import { useParams } from "react-router-dom";
import softwareupload from "../../../assets/software-upload.svg";
import Button from "@mui/material/Button";

const ImageUpload = (props) => {
  const ToCanvas = useContext(ImageContext);
  const roomId = useParams().roomId;

  const uploadimage = async (e) => {
    e.preventDefault();
    const images = e.target.files;

    const formdata = new FormData();
    for (let i = 0; i < images.length; i++) {
      formdata.append("images", images[i]);
      formdata.append("lastModified", images[i].lastModified);
    }
    formdata.append("roomid", roomId);

    axios
      .post("http://localhost:5000/photoBox/upload", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const neworigin = { ...ToCanvas.origin };
        res.data.forEach((url) => (neworigin[url] = 0));
        ToCanvas.setorigin(neworigin);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Button className="upload_button" variant="contained" component="label">
      <img src={softwareupload} alt="upload"></img>
      <input
        type="file"
        className="uploadinput"
        id="upload"
        hidden
        accept="image/*"
        multiple
        onChange={uploadimage}
      />
    </Button>
  );
};
export default ImageUpload;
