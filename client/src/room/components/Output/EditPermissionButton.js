import App from "../../../App";
import "./Output.css";
import { useEffect, useState } from "react";
const EditPermissionButton = () => {
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
      setRefresh({ ...refresh });
    });
  }, []);
  if (App.playlistPermissionState === 2) {
    return (
      <div className="permission_button_group">
        <button className="permission_button_disable">
          <label className="permission_label_able">누가 편집중!</label>
        </button>
      </div>
    );
  } else if (App.playlistPermissionState === 1) {
    return (
      <div className="permission_button_group">
        <button className="permission_button" onClick={releasePermission}>
          <label className="permission_label_able">편집 완료!</label>
        </button>
      </div>
    );
  } else {
    return (
      <div className="permission_button_group">
        <button className="permission_button" onClick={getPermission}>
          <label className="permission_label_able">playlist Edit</label>
        </button>
      </div>
    );
  }
};

export default EditPermissionButton;
