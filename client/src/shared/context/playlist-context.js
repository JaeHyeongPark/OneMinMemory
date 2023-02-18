import axios from "axios";
import { createContext, useEffect, useState } from "react";

const PlaylistContext = createContext({
  playlist: [],
  addToPlaylist: () => {},
});

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
    setPlaylist(track);
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
