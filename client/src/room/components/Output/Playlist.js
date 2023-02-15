import React, { useEffect, useState } from "react";
import axios from "axios";

import PlaylistShow from "./PlaylistShow";
import "./Playlist.css";

const Playlist = () => {
  const [playView, setPlayView] = useState({});
  const [playCheck, setPlayCheck] = useState(true);
  // const [check2, setcheck2] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/output/playlist").then((res) => {
      setPlayView(res.data);
    });
  }, [playCheck]);

  // useEffect(() => {
  //   axios.get("http://localhost:5000/photoBox/sendimages").then((res) => {
  //     setview(res.data);
  //   });
  // }, [check2]);

  const changePlayCheck = () => {
    setPlayCheck(playCheck ? false : true);
  };

  // const changecheck2 = () => {
  //   setcheck2(check2 ? false : true);
  // };

  return <PlaylistShow playView={playView} change={changePlayCheck} />;
};

export default Playlist;
