import axios from "axios";
import trash from "../../../assets/trash.svg";

const ImageDel = (props) => {
  const deleteImage = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/photoBox/deleteimage")
      .then((res) => {})
      .then((res) => {
        props.change()
      });
  };

  return (
    <div className="delete_button">
      <img src={trash} className="img.trash" alt="a" />
      <input
        className="delete_label"
        onClick={deleteImage}
        value="지우기"
        type="button"
      />
    </div>
  );
};
export default ImageDel;
