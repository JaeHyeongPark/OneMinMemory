import { useContext, useState } from "react";
import { AuthContext } from "../shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import enterArrow from "../room/assets/roomenter.png";
import clipboard from "../room/assets/copyLink.png";
import "./loginpage.css";

function LoginPage() {
  const AuthCtx = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const style = {
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "#17171e",
    // border: "1px solid #1976d2",
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
  };

  // 방생성으로 방의 난수를 받는다.(아직 DB에 저장 X)
  const handleOpen = (e) => {
    e.preventDefault();
    axios.get(process.env.REACT_APP_expressURL + "/home/roomid").then((res) => {
      AuthCtx.changeid(res.data.roomid);
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

  const copyurl = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(
        process.env.REACT_APP_myURL + `/room/${AuthCtx.rooomId}`
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="logininner">
      <div className="sign_body">
        <div className="sign" onClick={handleOpen}>
          <span>일분추억</span>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ color: "white" }}
          >
            아래 URL를 통해 친구들을 초대하세요!
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            style={{ color: "whitesmoke" }}
          >
            {"URL : " +
              process.env.REACT_APP_myURL +
              `/room/${AuthCtx.rooomId}`}
            <img
              src={clipboard}
              style={{ width: "15px", margin: "3px", cursor:"pointer"}}
              onClick={copyurl}
            />
          </Typography>
          <span
            style={{
              cursor: "pointer",
              position: "absolute",
              bottom: "25px",
              right: "30px",
            }}
            onClick={makeroom}
          >
            <img src={enterArrow} />
          </span>
        </Box>
      </Modal>
    </div>
  );
}
export default LoginPage;
