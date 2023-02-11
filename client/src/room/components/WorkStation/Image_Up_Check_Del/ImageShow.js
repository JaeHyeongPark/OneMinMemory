import axios from "axios";

const ImageShow = (props) => {
  const view = props.view;

  const selectimage = async (url) => {
    axios
      .post("http://localhost:5000/photoBox/clickimage", { url: url })
      .then((res) => {})
      .then((res) => {
        props.change();
      });
  };

  const context = Object.keys(view).map((url) => {
    if (view[url] === 0) {
      return (
        <img
          className="upload_img"
          key={url}
          src={url}
          alt="a"
          onClick={() => selectimage(url)}
        />
      );
    } else {
      return (
        <img
          className="select_img"
          key={url}
          src={url}
          alt="a"
          onClick={() => {
            props.onClick(url);
          }}
        />
      );
    }
  });
  return <div className="upload_Photos">{context}</div>;
};
export default ImageShow;
