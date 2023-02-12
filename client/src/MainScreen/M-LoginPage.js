import Loginimage from "./kakao.png";
import Startimage from "./kakaostart.png";
import css from "./loginpage.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function LoginPage() {
  // 로그인 했을때 안했을때 화면에 다르게 띄워준다.
  const [Islogin, setIsLogin] = useState(false);
  let context;

  function changeMode(e) {
    e.preventDefault();
    setIsLogin(true);
  }

  if (!Islogin) {
    context = (
      <Link to="/login">
        <img src={Loginimage} alt="" onClick={changeMode} />
      </Link>
    );
  } else {
    context = (
      <Link to="/room">
        <img src={Startimage} alt="" />
      </Link>
    );
  }
  return (
    <div className={css.logininner}>
      <div className={css.description}>
        <h1>일분추억</h1>
        <p>함께한 시간을 더 아름답게</p>
      </div>
      <div className={css.kakaologo} onClick={changeMode}>
        {context}
      </div>
    </div>
  );
}
export default LoginPage;
