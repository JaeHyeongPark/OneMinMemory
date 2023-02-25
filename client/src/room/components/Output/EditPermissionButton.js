import App from "../../../App";
import "./Output.css";
import { useEffect, useState, useContext } from "react";
import PlaylistContext from "../../../shared/context/playlist-context";
import DiscEdit from "../../assets/discedit.svg";

const EditPermissionButton = () => {
  const playlistCtx = useContext(PlaylistContext);

  const getPermission = () => {
    App.mainSocket.emit("playlistEditRequest", {
      roomId: App.roomId,
      Id: App.mainSocket.id,
    });
  };
  const releasePermission = () => {
    App.mainSocket.emit("playlistEditFinished", {
      roomId: App.roomId,
      Id: App.mainSocket.id,
    });
  };
  const [refresh, setRefresh] = useState({});
  useEffect(() => {
    App.mainSocket.on("playlistEditResponse", (data) => {
      App.playlistPermissionState = data.state;
      console.log(data.isChanged);
      if (data.isChanged === false) {
        setRefresh({ ...refresh });
      } else {
        playlistCtx.changeDT(undefined);
        playlistCtx.changeTT(undefined);
        playlistCtx.changeidx(undefined);
        playlistCtx.addToPlaylist(data.playlist);
        playlistCtx.changetime(undefined);
      }
    });
  }, []);
  if (App.playlistPermissionState === 2) {
    return (
      <button className="EditDisc_disable">
        <label className="EditDisc_label">누군가 편집중!</label>
      </button>
    );
  } else if (App.playlistPermissionState === 1) {
    return (
      <button className="EditDisc_fin" onClick={releasePermission}>
        <label className="EditDisc_label">편집 완료하기</label>
      </button>
    );
  } else {
    return (
      <button className="EditDisc" onClick={getPermission}>
        <img src={DiscEdit} alt="disc edit" />
        {/* <label className="permission_label_able">playlist Edit</label> */}
      </button>
    );
  }
};

export default EditPermissionButton;
