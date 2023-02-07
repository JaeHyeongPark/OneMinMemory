import image from "./kakao.png"
import css from "./loginpage.module.css"

function LoginPage(){
    return(
        <div className={css.logininner}>
            <div className={css.description}>
                <h1>일분추억</h1>
                <p>함께한 시간을 더 아름답게</p>
            </div>
            <div className={css.kakaologo}>
                <a href="/"><img src={image} alt=""/></a>
            </div>
        </div>
    )
}
export default LoginPage