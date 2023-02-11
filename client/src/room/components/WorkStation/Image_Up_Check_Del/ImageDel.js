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
      <label className="delete_label" htmlFor="delete_btn">지우기</label>
      <input
        id="delete_btn"
        onClick={deleteImage}
        value="지우기"
        type="button"
      />
    </div>
  );
};
export default ImageDel;
