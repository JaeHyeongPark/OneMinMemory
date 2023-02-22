import axios from "axios";
import { useContext } from "react";
import ImageContext from "./ImageContext";
import { AuthContext } from "../../../../shared/context/auth-context";
import softwareupload from "../../../assets/software-upload.svg";

const ImageUpload = (props) => {
  const ToCanvas = useContext(ImageContext)
  const AuthCtx = useContext(AuthContext);

  const uploadimage = async (e) => {
    e.preventDefault();
    const images = e.target.files;

    const formdata = new FormData();
    for (let i = 0; i < images.length; i++) {
      formdata.append("images", images[i]);
      formdata.append("lastModified", images[i].lastModified);
    }
    formdata.append("roomid", AuthCtx.rooomId)

    axios
      .post("http://localhost:5000/photoBox/upload", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const neworigin = {...ToCanvas.origin}
        res.data.forEach((url) => neworigin[url] = 0)
        ToCanvas.setorigin(neworigin)
        // props.change();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div >
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
