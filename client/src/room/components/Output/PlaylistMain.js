import { useDrop } from "react-dnd";
import { useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import PlaylistContext from "../../../shared/context/playlist-context";
import App from "../../../App";
import "./Playlist.css";

const PlaylistMain = (props) => {
  const playlistCtx = useContext(PlaylistContext);
  const AuthCtx = useContext(AuthContext);

  // const effect = playlistCtx.playlist[props.idx].effect;

  // 삭제 딜레이 커버 체크(상태) 변수
  App.check = true;
  const [{ isover }, playlist] = useDrop(() => ({
    accept: ["image", "effect"],
    drop: (item) => {
      if (item.type === "image") {
        sendTourl(item.url);
      } else {
        sendToeffect(item.className);
      }
    },
    collect: (monitor) => ({
      isover: monitor.isOver(),
    }),
  }));
  // 이미지 드랍으로 이미지를 재생목록에 추가
  const sendTourl = (url) => {
    if (App.playlistPermissionState !== 1) {
      return;
    }
    App.mainSocket.emit("postplaylist", {
      url,
      idx: props.i,
      roomId: App.roomId,
      Id: App.mainSocket.id,
    });
  };
  // 클릭후 삭제 버튼
  const deleteimg = (e) => {
    if (App.playlistPermissionState !== 1) {
      return;
    }
    e.preventDefault();
    App.check = false;
    App.mainSocket.emit("deleteplayurl", {
      idx: props.i,
      roomId: App.roomId,
      Id: App.mainSocket.id,
    });
  };
  // 재생목록 사진 클릭시 상황에 맞게 이벤트
  const Clickimg = (e) => {
    e.preventDefault();
    if (App.playlistPermissionState != 1) {
      return;
    }
    if (!App.check) return;
    App.mainSocket.emit("clicking", {
      roomId: App.roomId,
      Id: App.mainSocket.id,
      idx: props.i,
    });
  };

  const sendToeffect = (effect) => {
    App.mainSocket.emit("effect", {
      Id: App.mainSocket.id,
      roomId: App.roomId,
      idx: props.i,
      effect,
    });
  };

  return (
    <div
      ref={playlist}
      className={props.select ? "selecttoplay_img" : "toplay_img"}
      id={props.i}
      style={{
        width: String((props.duration * 100) / 60) + "%",
        height: "auto",
        backgroundImage: `url(${props.url})`,
        backgroundSize: "contain",
        backgroundRepeat: "repeat-x",
      }}
      key={props.url}
      onClick={Clickimg}
    >
      {props.url && props.select && (
        <button className="del" onClick={deleteimg}>
          X
        </button>
      )}
    </div>
  );
};

export default PlaylistMain;
