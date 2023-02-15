import axios from "axios";
import softwareupload from "../../../assets/software-upload.svg";

const ImageUpload = (props) => {
  const uploadimage = async (e) => {
    e.preventDefault();
    const images = e.target.files;

    const formdata = new FormData();
    for (let i = 0; i < images.length; i++) {
      formdata.append("images", images[i]);
      formdata.append("lastModified", images[i].lastModified);
    }

    axios
      .post("http://localhost:5000/photoBox/upload", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        props.change();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="uploadButton">
      <img src={softwareupload} className="img.software-upload" alt="a" />
      <label className="upload_label" htmlFor="upload">
        업로드
      </label>
      <input
        type="file"
        id="upload"
        accept="image/*"
        multiple
        onChange={uploadimage}
      />
    </div>
  );
};
export default ImageUpload;
