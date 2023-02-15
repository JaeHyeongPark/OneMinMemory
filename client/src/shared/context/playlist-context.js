import axios from "axios";
import { createContext, useEffect, useState } from "react";

const PlaylistContext = createContext({
  playlist: {},
  addToPlaylist: () => {},
});

export const PlaylistContextProvider = (props) => {
  //   const [isChanged, setIsChanged] = useState(false);
  const [playlist, setPlaylist] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/output/playlist").then((res) => {
      console.log(res.data);
      setPlaylist(res.data);
    });
  }, []);

  //   const setChangeHandler = () => {};

  const addToPlaylistHandler = (track) => {
    let temp = { ...playlist, track };
    setPlaylist(temp);
    console.log(playlist);
  };

  const context = {
    playlist: playlist,
    addToPlaylist: addToPlaylistHandler,
  };

  return (
    <PlaylistContext.Provider value={context}>
      {props.children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContext;
