import React, { useEffect, useState } from "react";
import axios from "axios";

import PlaylistShow from "./PlaylistShow";
import "./Playlist.css";

const Playlist = () => {
  const [view, setview] = useState({});
  const [check, setcheck] = useState(true);
  // const [check2, setcheck2] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/photoBox/playlist").then((res) => {
      setview(res.data);
    });
  }, [check]);

  // useEffect(() => {
  //   axios.get("http://localhost:5000/photoBox/sendimages").then((res) => {
  //     setview(res.data);
  //   });
  // }, [check2]);

  const changecheck1 = () => {
    setcheck(check ? false : true);
  };

  // const changecheck2 = () => {
  //   setcheck2(check2 ? false : true);
  // };

  return (
    <div className="playlist_layout">
      <PlaylistShow view={view} change={changecheck1} />
    </div>
  );
};

export default Playlist;
