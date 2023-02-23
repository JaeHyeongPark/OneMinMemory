import Startimage from "./kakaostart.png";
import css from "./loginpage.module.css";
import { useContext, useState } from "react";
import { AuthContext } from "../shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";

function LoginPage() {
  const AuthCtx = useContext(AuthContext);
  // const [id, setid] = useState('')
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "gainsboro",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleOpen = (e) => {
    e.preventDefault();
    axios.get("http://localhost:5000/home/roomid").then((res) => {
      AuthCtx.changeid(res.data);
    });
    setOpen(true);
  };

  const makeroom = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/home/makeroom", {id: AuthCtx.rooomId}).then((res) => {
      const url = `/room/${AuthCtx.rooomId}`
      navigate(url)
    });
  }

  return (
    <div className={css.logininner}>
      <div className={css.description}>
        <h1>일분추억</h1>
        <p>함께한 시간을 더 아름답게</p>
      </div>
      <div className={css.kakaologo}>
        <img
          src={Startimage}
          alt=""
          onClick={handleOpen}
          style={{ cursor: "pointer" }}
        />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            아래 URL를 통해 친구들을 초대하세요!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {`http://localhost:3000/room/${AuthCtx.rooomId}`}
          </Typography>
          <span style={{ cursor: "pointer" }} onClick={makeroom}>시작하기</span>
        </Box>
      </Modal>
    </div>
  );
}
export default LoginPage;
