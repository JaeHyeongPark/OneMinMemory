import axios from "axios";
import Picture from "./Picture";

const ImageShow = (props) => {
  const view = props.view;
  const mode = props.mode

  const context = Object.keys(view).sort().map((url) => {
    if (view[url] === 0) {
      return (
        <Picture className="upload_img" url={url} mode={mode}/>
      );
    } else {
      return (
        <Picture className="select_img" url={url} mode={mode}/>
      );
    }
  });
  return <div className="upload_Photos">{context}</div>;
};
export default ImageShow;
