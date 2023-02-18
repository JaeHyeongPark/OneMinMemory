import axios from "axios";
import { createContext, useEffect, useState } from "react";

const PlaylistContext = createContext();

export const PlaylistContextProvider = (props) => {
  //   const [isChanged, setIsChanged] = useState(false);
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/output/getplaylist").then((res) => {
      setPlaylist(res.data.results);
    });
  }, []);

  //   const setChangeHandler = () => {};

  const addToPlaylistHandler = (track) => {
    // console.log(track);
    let temp = [...playlist, track];
    setPlaylist(temp);
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
