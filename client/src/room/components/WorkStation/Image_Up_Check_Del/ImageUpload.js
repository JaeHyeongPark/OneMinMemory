import axios from "axios";
import softwareupload from "../../../assets/software-upload.svg";
import App from "../../../../App.js";

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
      .post("http://chjungle.shop/api/photoBox/upload", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        props.change();
        // 누군가 사진을 업로드 했음을 서버에 알림
        App.mainSocket.emit("pictureUpload", {
          Id: App.mainSocket.id,
          roomId: App.roomId,
        });
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
