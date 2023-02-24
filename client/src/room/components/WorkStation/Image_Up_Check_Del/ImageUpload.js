import axios from "axios";
import { useContext } from "react";
import ImageContext from "./ImageContext";
import { useParams } from "react-router-dom";
import softwareupload from "../../../assets/software-upload.svg";
import App from "../../../../App.js";

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
        if (res.data.success != true) {
          console.log("응답에러");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <label className="uploadButton" htmlFor="upload">
        <img src={softwareupload} className="img.software-upload" alt="a" />
      </label>
      <input
        type="file"
        className="uploadinput"
        id="upload"
        accept="image/*"
        multiple
        onChange={uploadimage}
      />
    </div>
  );
};
export default ImageUpload;
