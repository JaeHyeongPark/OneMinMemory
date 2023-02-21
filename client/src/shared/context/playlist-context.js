import axios from "axios";
import { createContext, useEffect, useState } from "react";

const PlaylistContext = createContext({
  playlist: [],
  selecttime: "",
  selectDT: "",
  totaltime: 0,
  selectidx: "",
  changeidx: () => {},
  changeTT: () => {},
  changeDT: () => {},
  changetime: () => {},
  translist: [],
  addToPlaylist: () => {},
});

export const PlaylistContextProvider = (props) => {
  //   const [isChanged, setIsChanged] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [time, settime] = useState("");
  const [DT, setDT] = useState("");
  const [TT, setTT] = useState(0);
  const [idx, setidx] = useState("");
  const [translist, setTranslist] = useState([]);

  useEffect(() => {
    axios.get("http://chjungle.shop/api/output/getplaylist").then((res) => {
      setPlaylist(res.data.results);
    });
  }, []);

  useEffect(() => {
    setTranslist([
      {
        transition: [
          "-filter_complex",
          "[0:v][1:v]xfade=transition=hrslice:duration=1:offset=3",
        ],
      },
      {
        transition: [
          "-filter_complex",
          "[0:v][1:v]xfade=transition=distance:duration=1:offset=3",
        ],
      },
      {
        transition: [
          "-filter_complex",
          "[0:v][1:v]xfade=transition=rectcrop:duration=1:offset=3",
        ],
      },
      {
        transition: [
          "-filter_complex",
          "[0:v][1:v]xfade=transition=radial:duration=1:offset=3",
        ],
      },
      {
        transition: [
          "-filter_complex",
          "[0:v][1:v]xfade=transition=pixelize:duration=1:offset=3",
        ],
      },
    ]);
  }, []);

  //   const setChangeHandler = () => {};

  const addToPlaylistHandler = (track) => {
    setPlaylist(track);
    console.log(playlist);
  };
  const changetime = (time) => {
    settime(time);
  };
  const changeDT = (DT) => {
    setDT(DT);
  };
  const changeTT = (TT) => {
    setTT(TT);
  };
  const changeidx = (idx) => {
    setidx(idx);
  };

  const context = {
    playlist: playlist,
    selecttime: time,
    selectDT: DT,
    totaltime: TT,
    selectidx: idx,
    changeidx: changeidx,
    changeTT: changeTT,
    changeDT: changeDT,
    changetime: changetime,
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
