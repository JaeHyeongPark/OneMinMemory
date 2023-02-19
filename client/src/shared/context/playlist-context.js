import axios from "axios";
import { createContext, useEffect, useState } from "react";

const PlaylistContext = createContext({
  playlist: [],
  translist: [],
  addToPlaylist: () => {},
});

export const PlaylistContextProvider = (props) => {
  //   const [isChanged, setIsChanged] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [translist, setTranslist] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/output/getplaylist").then((res) => {
      setPlaylist(res.data.results);
    });
  }, []);

  useEffect(() => {
    setTranslist([
      {
        transition: [
          "-filter_complex",
          "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4",
        ],
      },
      {
        transition: [
          "-filter_complex",
          "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4",
        ],
      },
      {
        transition: [
          "-filter_complex",
          "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4",
        ],
      },
      {
        transition: [
          "-filter_complex",
          "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4",
        ],
      },
      {
        transition: [
          "-filter_complex",
          "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4",
        ],
      },
    ]);
  }, []);

  //   const setChangeHandler = () => {};

  const addToPlaylistHandler = (track) => {
    setPlaylist(track);
    console.log(playlist);
  };

  const context = {
    playlist: playlist,
    translist: translist,
    addToPlaylist: addToPlaylistHandler,
  };

  return (
    <PlaylistContext.Provider value={context}>
      {props.children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContext;
