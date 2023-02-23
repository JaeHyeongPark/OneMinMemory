import axios from "axios";
import { useDrop } from "react-dnd";
import { useContext } from "react";
import PlaylistContext from "../../../shared/context/playlist-context";
// import { AuthContext } from "../../../shared/context/auth-context";
import { useParams } from "react-router-dom";

const TransitionButton = (props) => {
  const playlistCtx = useContext(PlaylistContext);
  // const AuthCtx = useContext(AuthContext);
  const roomId = useParams().roomId;
  const [{ isover }, playlist] = useDrop(() => ({
    accept: ["transition"],
    drop: (item) => sendTotransition(item.className),
    collect: (monitor) => ({
      isover: monitor.isOver(),
    }),
  }));

  const transition = playlistCtx.playlist[props.idx].transition

  const sendTotransition = (transition) => {
    axios
      .post("http://localhost:5000/output/transition", {
        transition,
        idx: props.idx,
        roomid:roomId
      })
      .then((res) => playlistCtx.addToPlaylist(res.data));
  };
  const deltransition = (e) => {
    e.preventDefault()
    axios
      .post("http://localhost:5000/output/deltransition", {
        idx: props.idx,
        roomid:roomId
      })
      .then((res) => playlistCtx.addToPlaylist(res.data));
  }


  let content
  if (transition === '') {
    content = (
      <div
        ref={playlist}
        className={props.className}
        style={{
          width: String((1 * 100) / 60) + "%",
        }}
      />
    );
  } else {
    content = (
      <div
        ref={playlist}
        className={props.className}
        style={{
          width: String((1 * 100) / 60) + "%",
          border: "solid 5px #e2f01d",
          cursor:"pointer"
        }}
        onClick={deltransition}
      />
    );
  }
  return content ;
};
export default TransitionButton;
