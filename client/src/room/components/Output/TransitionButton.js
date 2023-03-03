import axios from "axios";
import { useDrop } from "react-dnd";
import { useContext } from "react";
import PlaylistContext from "../../../shared/context/playlist-context";
import { useParams } from "react-router-dom";
import App from "../../../App";
import SnackBar from "../RoomHeader/SnackBar";
import trans_off from "../../assets/transition_off.png";
import trans_on from "../../assets/transition_on.png";
import { DraggingContext } from "../../pages/DraggingContext";

const TransitionButton = (props) => {
  const playlistCtx = useContext(PlaylistContext);
  const roomId = useParams().roomId;
  // DraggingContext
  const { transDrag } = useContext(DraggingContext);

  const [{ isover }, playlist] = useDrop(() => ({
    accept: ["transition"],
    drop: (item) => sendTotransition(item.className),
    collect: (monitor) => ({
      isover: monitor.isOver(),
    }),
  }));

  const transition = playlistCtx.playlist[props.idx].transition;

  const sendTotransition = (transition) => {
    if (App.playlistPermissionState !== 1) {
      SnackBar.playlistEditWarningOpen();
      return;
    }
    axios
      .post(process.env.REACT_APP_expressURL + "/output/transition", {
        transition,
        idx: props.idx,
        roomid: roomId,
      })
      .then((res) => {
        if (res.data.success !== true) {
          console.log("응답에러");
        }
      });
  };
  const deltransition = (e) => {
    if (App.playlistPermissionState !== 1) {
      SnackBar.playlistEditWarningOpen();
      return;
    }
    e.preventDefault();
    axios
      .post(process.env.REACT_APP_expressURL + "/output/deltransition", {
        idx: props.idx,
        roomid: roomId,
      })
      .then((res) => {
        if (res.data.success !== true) {
          console.log("응답에러");
        }
      });
  };

  let content;
  if (transition === "") {
    content = (
      <img
        ref={playlist}
        className="toplay_transOff"
        src={trans_off}
        style={{
          width: String((2 * 100) / 60) + "%",
          border: transDrag && "2px solid #1484CD",
          boxShadow:
            transDrag &&
            "0 0 2px #1484CD, 0 0 2px #1484CD, 0 0 20px #1484CD, 0 0 8px #1484CD, 0 0 28px #1484CD, inset 0 0 13px #1484CD",
        }}
        alt="transoff"
      />
    );
  } else {
    content = (
      <img
        ref={playlist}
        className="toplay_transOn"
        src={trans_on}
        style={{
          width: String((2 * 100) / 60) + "%",
          cursor: "pointer",
          border: transDrag && "2px solid #1484CD",
          boxShadow:
            transDrag &&
            "0 0 2px #1484CD, 0 0 2px #1484CD, 0 0 20px #1484CD, 0 0 8px #1484CD, 0 0 28px #1484CD, inset 0 0 13px #1484CD",
        }}
        onClick={deltransition}
        alt="transon"
      />
    );
  }
  return content;
};
export default TransitionButton;
