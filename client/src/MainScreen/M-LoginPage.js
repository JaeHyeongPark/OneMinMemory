import Startimage from "./kakaostart.png";
import { useContext, useState } from "react";
import { AuthContext } from "../shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
// require("dotenv").config();
import "./loginpage.css";

function LoginPage() {
  const AuthCtx = useContext(AuthContext);
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

  // 방생성으로 방의 난수를 받는다.(아직 DB에 저장 X)
  const handleOpen = (e) => {
    e.preventDefault();
    axios.get(process.env.REACT_APP_expressURL + "/home/roomid").then((res) => {
      AuthCtx.changeid(res.data);
    });
    setOpen(true);
  };

  // 위에서 받은 난수로 DB에 방저장후 room으로 이동(DB 저장 O)
  const makeroom = async (e) => {
    e.preventDefault();
    await axios
      .post(process.env.REACT_APP_expressURL + "/home/makeroom", {
        id: AuthCtx.rooomId,
      })
      .then((res) => {
        const url = `/room/${AuthCtx.rooomId}`;
        navigate(url);
      });
  };

  return (
    <div className="logininner">
      <div className="sign_body">
        <div className="sign" onClick={handleOpen}>
          <span>일분추억</span>
        </div>
      </div>
      {/* <div className="kakaologo">
        <img
          src={Startimage}
          alt=""
          onClick={handleOpen}
          style={{ cursor: "pointer" }}
        />
      </div> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            아래 URL를 통해 친구들을 초대하세요!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {process.env.REACT_APP_myURL + `/room/${AuthCtx.rooomId}`}
          </Typography>
          <span style={{ cursor: "pointer" }} onClick={makeroom}>
            시작하기
          </span>
        </Box>
      </Modal>
    </div>
  );
}
export default LoginPage;
