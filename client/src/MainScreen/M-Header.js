import css from "./header.module.css";
import minlogo from "./photo-512-white.png";

function MainHeader() {
  return (
    <div className={css.MHcontainer}>
      <div className={css.MHInner}>
        <div className={css.Logo_and_Icon}>
          <span className={css.home_logo_span}>일분추억</span>
          <div className={css.logoIcon}>
            <img src={minlogo} className={css.logo_black} alt="a" />
          </div>
        </div>
        {/* <div className={css.feedback_button}>
          <span className={css.feedback_span}>Feedback</span>
        </div> */}
      </div>
      <hr />
    </div>
  );
}
export default MainHeader;
