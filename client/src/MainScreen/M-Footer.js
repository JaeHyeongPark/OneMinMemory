import { BsGithub } from "react-icons/bs";
import { TfiYoutube } from "react-icons/tfi";
import { BsInstagram } from "react-icons/bs";
import css from "./footer.module.css";

function MainFooter() {
  return (
    <div className={css.footercontainer}>
      <div className={css.footertag}>
        <div className={css.tags}>
          {/* <a href="https://github.com/JaeHyeongPark/namanmoo">
            <BsGithub size={40} color="#ffffff" />
          </a>
          <a href="https://www.youtube.com/premium">
            <TfiYoutube size={40} color="#ffffff" />
          </a>
          <a href="https://www.instagram.com/">
            <BsInstagram size={40} color="#ffffff" />
          </a> */}
        </div>
        <p>
          {/* <span>Design : HTML5</span>
          <span>Frontend : React</span>
          <span>Backend : Node.js Express</span> */}
        </p>
      </div>
    </div>
  );
}
export default MainFooter;
