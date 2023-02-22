import React, { useEffect } from "react";
import axios from "axios";
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
  let check = true;
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
    // axios
    //   .post("http://localhost:5000/output/postplaylist", {
    //     url: url,
    //     idx: props.i,
    //   })
    //   .then((res) => {
    //     // playlistCtx.addToPlaylist(res.data);
    //     if (res.data != true) {
    //       console.log("플레이리스트에 사진 추가 과정에 에러가 있습니다");
    //     }
    //   });
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
    check = false;
    // axios
    //   .post("http://localhost:5000/output/deleteplayurl", {
    //     idx: props.i,
    //   })
    //   .then((res) => {
    //     playlistCtx.addToPlaylist(res.data);
    //     playlistCtx.changetime("");
    //     check = true;
    //   });
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
    if (!check) return;
    // axios
    //   .post("http://localhost:5000/output/clickimg", {
    //     idx: props.i,
    //   })
    //   .then((res) => {
    //     playlistCtx.changeDT(res.data.duration);
    //     playlistCtx.changeTT(res.data.totaltime);
    //     playlistCtx.changeidx(props.i);
    //     playlistCtx.addToPlaylist(res.data.playlist);
    //     playlistCtx.changetime(res.data.time);
    //   });
    App.mainSocket.emit("clicking", {
      roomId: App.roomId,
      Id: App.mainSocket.id,
      idx: props.i,
    });
  };

  const sendToeffect = (effect) => {
    axios
      .post("http://localhost:5000/output/effect", {
        effect,
        idx: props.i,
        roomid: AuthCtx.rooomId,
      })
      .then((res) => playlistCtx.addToPlaylist(res.data));
  };
  // 다른사람이 playlist를 수정했을 때 동기화를 위한 소캣이벤트 추가
  useEffect(() => {
    // 그냥 playlist만 입력하면 수정사항이 적용되는 경우
    // 이미지 삭제, 추가, 효과 추가, 삭제
    App.mainSocket.on("playlistChanged", (data) => {
      playlistCtx.addToPlaylist(data.playlist);
      playlistCtx.changetime("");
      check = true;
    });
    // 이미지 클릭 핸들링
    App.mainSocket.on("clicking", (data) => {
      playlistCtx.changeDT(data.duration);
      playlistCtx.changeTT(data.totaltime);
      playlistCtx.changeidx(data.idx);
      playlistCtx.addToPlaylist(data.playlist);
      playlistCtx.changetime(data.time);
    });
    App.mainSocket.on("changetime", (data) => {
      playlistCtx.addToPlaylist(data.playlist);
      playlistCtx.changetime("");
      playlistCtx.changeDT(data.DT);
    });
  }, []);
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
