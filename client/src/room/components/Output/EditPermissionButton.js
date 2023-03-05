import App from "../../../App";
import "./Output.css";
import { useEffect, useState, useContext } from "react";
import PlaylistContext from "../../../shared/context/playlist-context";
import DiscEdit from "../../assets/discedit.svg";
import Button from "@mui/material/Button";

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
  EditPermissionButton.setRefresh = () => {
    setRefresh({ ...refresh });
  };
  if (App.playlistPermissionState === 2) {
    return (
      <div className="EditDisc_div">
        <button className="EditDisc_disable">
          <label className="EditDisc_label">누군가 편집중!</label>
        </button>
      </div>
    );
  } else if (App.playlistPermissionState === 1) {
    return (
      <div className="EditDisc_div">
        <button className="EditDisc_fin" onClick={releasePermission}>
          <label className="EditDisc_label">편집 완료하기</label>
        </button>
      </div>
    );
  } else {
    return (
      <Button className="EditDisc" onClick={getPermission}>
        <div className="EditDisc_img_layout">
          <img src={DiscEdit} alt="disc edit" className="EditDisc_img" />
        </div>
        <span className="editdisc_span">EDIT</span>
        {/* <label className="permission_label_able">playlist Edit</label> */}
      </Button>
    );
  }
};

export default EditPermissionButton;
