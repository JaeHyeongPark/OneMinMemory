import { useContext } from "react";
import ImageContext from "./ImageContext";
import image from "../../../assets/image.svg";
import RightArrow from "../../../assets/RightArrow.svg";

const WorkButton = (props) => {
    const ToCanvas = useContext(ImageContext)
    const view = props.view

    const sendCanvas = (e) => {
        e.preventDefault()
        const sum = Object.values(view).reduce((total, current) => total + current, 0)
        if (sum > 1 || sum === 0){
          return alert("사진을 골라 주세요 혹은 한 개의 사진만 골라주세요!")
        }
        const selectUrl = Object.keys(view).filter((url) => {
          return view[url] === 1
        })
        ToCanvas.sendurl(selectUrl)
      }
  return (
    <div className="Work_and_arrow">
      <div className="Work">
        <img src={image} className="img.image" alt="a" />
        <label className="work_label" onClick={sendCanvas}>
          작 업 하 기
        </label>
      </div>
      <div className="Arrow">
        <img src={RightArrow} className="img.Icon-Arrow" alt="a" />
      </div>
    </div>
  );
};
export default WorkButton;
