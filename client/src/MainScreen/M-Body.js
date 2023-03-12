import css from "./body.module.css";
import LoginPage from "./M-LoginPage";
import "./Body.css";
function MainBody() {
  return (
    <div className={css.MBcontainer}>
      <div class="main">
        <div class="d1"></div>
        <div class="d2"></div>
        <div class="d3"></div>
        <div class="d4"></div>
        <div class="login_p">
          <LoginPage />
        </div>
      </div>
    </div>
  );
}
export default MainBody;
