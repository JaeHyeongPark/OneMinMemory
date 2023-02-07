import { FcPhotoReel } from "react-icons/fc";
import css from "./header.module.css";

function MainHeader() {
  return (
    <div className={css.MHcontainer}>
      <div className={css.MHInner}>
        <h1>
          일분추억
          <FcPhotoReel size={40} />
        </h1>
        <button className={css.MHbutton}>
          <p>이용 방법</p>
        </button>
      </div>
        <hr />
    </div>
  );
}
export default MainHeader;
