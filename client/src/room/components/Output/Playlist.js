import React, { useContext } from "react";
// import axios from "axios";

import PlaylistContext from "../../../shared/context/playlist-context";
// import PlaylistShow from "./PlaylistShow";
import "./Playlist.css";

const Playlist = () => {
  const playlistCtx = useContext(PlaylistContext);
  const playlistView = playlistCtx.playlist;
  console.log(playlistView);

  // const [playView, setPlayView] = useState({});
  // const [playCheck, setPlayCheck] = useState(true);
  // const [check2, setcheck2] = useState(true);

  // useEffect(() => {
  //   axios.get("http://localhost:5000/output/playlist").then((res) => {
  //     setPlayView(res.data);
  //   });
  // }, [playlistCtx.playlist]);

  // useEffect(() => {
  //   axios.get("http://localhost:5000/photoBox/sendimages").then((res) => {
  //     setview(res.data);
  //   });
  // }, [check2]);

  // const changePlayCheck = () => {
  //   setPlayCheck(playCheck ? false : true);
  // };

  // const changecheck2 = () => {
  //   setcheck2(check2 ? false : true);
  // };

  //   const selectimage = async (url) => {
  //     axios
  //       .post("http://localhost:5000/photoBox/clickimage", { url: url })
  //       .then((res) => {})
  //       .then((res) => {
  //         props.change();
  //       });
  //   };

  const context = Object.keys(playlistView).map((url) => {
    if (playlistView[url] === 0) {
      return (
        <img
          className="toplay_img"
          key={url}
          src={url}
          alt="a"
          //   onClick={() => selectimage(url)}
        />
      );
    } else {
      return (
        <img
          className="toplay_select_img"
          key={url}
          src={url}
          alt="a"
          //   onClick={() => {
          //     selectimage(url);
          //   }}
        />
      );
    }
  });

  return <div className="playlist_layout">{context}</div>;
};

export default Playlist;
