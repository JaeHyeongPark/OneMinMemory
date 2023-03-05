import App from "../../../App";
import "./Output.css";
import { useEffect, useState, useContext } from "react";
import PlaylistContext from "../../../shared/context/playlist-context";
import DiscEdit from "../../assets/discedit.svg";
import Lock from "../../assets/lock.svg";
import Unlock from "../../assets/unlock.svg";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const mytheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#048848",
    },
    tertiary: {
      main: "#B41400",
    },
  },
});

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
      <ThemeProvider theme={mytheme}>
        <Button className="EditDisc" color="tertiary" variant="contained">
          <div className="EditDisc_img_layout">
            <img src={Lock} alt="disc edit" className="EditDisc_img" />
          </div>
          <span className="editdisc_span">EDITING NOW..</span>
          {/* <label className="permission_label_able">playlist Edit</label> */}
        </Button>
      </ThemeProvider>
    );
  } else if (App.playlistPermissionState === 1) {
    return (
      <ThemeProvider theme={mytheme}>
        <Button
          className="EditDisc"
          variant="contained"
          color="secondary"
          onClick={releasePermission}
        >
          <div className="EditDisc_img_layout">
            <img src={Unlock} alt="disc edit" className="EditDisc_img" />
          </div>
          <span className="editdisc_span">FINISH EDITING</span>
          {/* <label className="permission_label_able">playlist Edit</label> */}
        </Button>
      </ThemeProvider>
    );
  } else {
    return (
      <Button className="EditDisc" variant="contained" onClick={getPermission}>
        <div className="EditDisc_img_layout">
          <img src={DiscEdit} alt="disc edit" className="EditDisc_img" />
        </div>
        <span className="editdisc_span">EDIT PLAYLIST</span>
        {/* <label className="permission_label_able">playlist Edit</label> */}
      </Button>
    );
  }
};

export default EditPermissionButton;
