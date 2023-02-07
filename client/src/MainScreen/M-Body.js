import css from "./body.module.css";
import background from "./background.png";
import LoginPage from "./M-LoginPage";

function MainBody() {
  return (
    <div className={css.MBcontainer}>
      <div className={css.MBtitle}>
        <LoginPage />
      </div>
      <div className={css.MBback}>
        <div className={css.MBbackground}>
          <img src={background} alt="background"/>
        </div>
      </div>
    </div>
  );
}
export default MainBody;
